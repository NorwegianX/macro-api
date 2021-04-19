/**
 * @param {object} arc - the parsed app.arc file currently executing
 * @param {object} cloudformation - the current AWS::Serverless CloudFormation template
 * @param {object} stage - the application stage (one of `staging` or `production`)
 */
module.exports = function myCustomMacro(arc, cloudformation, stage) {
  if (!arc.users) {
    // no user pools today :'(
    return cloudformation;
  }

  // Create a user pool with some very limited attributes
  // This is the thing that lets us have users! :D
  cloudformation.Resources["ArcUserPool"] = {
    Type: "AWS::Cognito::UserPool",
    Properties: {
      UserPoolName: `${arc.app[0]}-${stage}`,
      AutoVerifiedAttributes: ["email"],
      UsernameAttributes: ["email"],
      Schema: [
        {
          Name: "email",
          AttributeDataType: "String",
          Mutable: false,
          Required: true,
        },
      ],
    },
  };

  // Create a user pool for each application that requires access to the api.
  // This is the minimal amount of config.
  // ALLOW_USER_SRP_AUTH is username and password auth but the password never gets sent to the server
  // ALLOW_REFRESH_TOKEN_AUTH is required by amplify login (I think)
  arc.users.forEach((userpool) => {
    cloudformation.Resources[`ArcUserPoolClient${userpool}`] = {
      Type: "AWS::Cognito::UserPoolClient",
      Properties: {
        ClientName: `${arc.app[0]}-${stage}-${userpool}`,
        UserPoolId: {
          Ref: "ArcUserPool",
        },
        SupportedIdentityProviders: ["COGNITO"],
        ExplicitAuthFlows: ["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"],
      },
    };
  });

  // Find the endpoints that need authentication
  let authEndpoints = arc.http.filter((http) => http.length >= 3);

  console.log(authEndpoints);

  cloudformation.Resources["HTTP"].Properties["Auth"] = {};
  cloudformation.Resources["HTTP"].Properties["Auth"]["Authorizers"] = {};

  authEndpoints.forEach((authorizer) => {
    const func = authorizer.splice(0, 2);

    // add an endpoints authorizer (note this operation could be duplicated unecessarily right now 🤷‍♂️)
    cloudformation.Resources["HTTP"].Properties["Auth"]["Authorizers"][
      `Authorizer${authorizer.join("")}`
    ] = {
      IdentitySource: "$request.header.Authorization",
      JwtConfiguration: {
        audience: authorizer.map((auth) => ({
          Ref: `ArcUserPoolClient${auth}`,
        })),
        issuer: {
          "Fn::GetAtt": "ArcUserPool.ProviderURL",
        },
      },
    };

    // breaks for index route 🧨
    // Find the function in the sam template to add the authorizer too
    let functionName = `${capitalizeFirstLetter(func[0])}${func[1]
      .split("/")
      .map((el) => capitalizeFirstLetter(el))
      .join("")}`;

    // Add authorizer to the http event
    cloudformation.Resources[functionName].Properties.Events[
      `${functionName}Event`
    ].Properties["Auth"] = {
      Authorizer: `Authorizer${authorizer.join("")}`,
    };

    console.log(
      `Added authorizer ${`Authorizer${authorizer.join(
        ""
      )}`} to ${functionName}`
    );
  });
  return cloudformation;
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
