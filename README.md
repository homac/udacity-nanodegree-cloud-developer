Before applying deployment, configuration needs to be set:

$ kubectl create configmap env-config --from-env-file ./configmap.env
$ kubectl create secret generic aws-secret --from-file=~/.aws/credentials 

