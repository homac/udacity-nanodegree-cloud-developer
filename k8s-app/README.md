# k8s setup instructions

Base repository for deployment is this repo (https://github.com/homac/udacity-cloud-developer-c3-deployment)

- Setup kubernetes cluster running on AWS according to https://github.com/kubermatic/kubeone/blob/master/docs/quickstart-aws.md
- Apply configuration in cluster:

Create file configmap.env and set corresponding variables:
POSTGRESS_USERNAME=
POSTGRESS_PASSWORD=
POSTGRESS_DB=
POSTGRESS_HOST=
AWS_DB_DIALECT=
AWS_REGION=
AWS_PROFILE=
AWS_BUCKET=
JWT_SECRET=
URL=http://localhost:8100

Then run:

  kubectl create configmap env-config --from-env-file ./configmap.env
  kubectl create secret generic aws-secret --from-file=~/.aws/credentials 

- Apply deployments and services with kubectl in directory k8s/

The project is split up into multiple repositories, each with it's own CI::

- backend-feed:
  git: https://github.com/homac/udacity-cloud-developer-c3-feed
  CI: https://travis-ci.com/homac/udacity-cloud-developer-c3-feed
- backend-user:
  git: https://github.com/homac/udacity-cloud-developer-c3-user
  CI: https://travis-ci.com/homac/udacity-cloud-developer-c3-user
- frontend:
  git: https://github.com/homac/udacity-cloud-developer-c3-frontend
  https://travis-ci.com/homac/udacity-cloud-developer-c3-frontend
- deployment repo:
  git: https://github.com/homac/udacity-cloud-developer-c3-deployment

  CI for deployment repo not used, thus docker-compose-build.yaml also unused because every repo builds and pushes their image on their own.n
