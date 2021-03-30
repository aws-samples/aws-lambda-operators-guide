# Operating and troubleshooting Lambda-based applications

This repo contains the example project for the the *Operating and troubleshooting Lambda-based applications* guide. Read the guide for full instructions and a walkthrough.

Important: this application uses various AWS services and there are costs associated with these services after the Free Tier usage - please see the [AWS Pricing page](https://aws.amazon.com/pricing/) for details. You are responsible for any AWS costs incurred. No warranty is implied in this example.

```bash
.
├── README.MD                   <-- This instructions file
├── backend                     <-- Coffee lookup backend application
├── frontend                    <-- Coffee lookup frontend application
```
## Requirements

* AWS CLI already configured with Administrator permissions
* [AWS SAM CLI installed](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* [NodeJS 12.x installed](https://nodejs.org/en/download/)

## Installation Instructions

1. [Create an AWS account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html) if you do not already have one and login.

2. Clone the repo onto your local development machine:
```
git clone https://github.com/aws-samples/aws-lambda-operators-guide
```
3. Set up the coffee-lookup backend
```
cd ./backend/setup
node ./setup.js
```
4. Build and deploy the SAM template:
```
cd ../
sam build
sam deploy --guided
```
5. When prompted for parameters, enter a stack name, Region and other parameters as needed.
6. To install the frontend:
```
cd ../frontend
npm install
npm run serve
```

## More information

The guide referenced at the top of this README file contains additional information about each example's design and architecture.

If you have any questions, please contact the author or raise an issue in the GitHub repo.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
