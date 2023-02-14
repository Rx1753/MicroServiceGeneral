# MicroServiceGeneral

Create project : `npm init`

Tyscript Support : `tsc --init`

To create general service for Auth

## SetUp

1. Common module consits of Error handling & Nats

- Create account & organization
- cd common
- `git init`
- `git add .`
- `git commit -m "initial commit"`
- `npm publish --access public`

2. Setup local host in terminal:

- `code /etc/hosts`

  eg : 127.0.0.1 domain name

3. Install Docker in system

4. Install ingress in local system ([link](https://kubernetes.github.io/ingress-nginx/deploy/)

## Services

Create Auth service with src folder & Docker file

- index.ts : Db & nats setup
- app.ts : set up for routers

Create Docker image

- `docker build -t dockerAccountName/servicename .`
- `docker push dockerAccountName/servicename`

## Infra/k8s

Services will be used as an image and run that docker file into kubernets using depl files in infra

- auth-depl.yaml: auth service with image name & env variables
- auth-mongo.depl.yaml: port and mongo db volumes in defined to run it in kubernets
- ingress-srv.yaml: local host routing setup to run it in kubernets
- nats-depl.yaml: nats is used for microservices streaming with publisher & listener

In project we are going to use common library package for nats events and listeners

- Run app in local env using Skaffold
  skaffold dev

## Kubernets

Creating a Secret: Kubectl create secret generic jet-secret—from-literal=jwt=asdf

To delete services & depl:

- `kubectl delete --all deployment`
- `kubectl delete --all services`

## Useful commands for Kubernets & Docker

- `kubectl get deployments`
- `kubectl get pods`
- `kubectl get services` //get all services from kubernets
- `kubectl describe service posts-srv` //Describe services
- `kubectl rollout restart deployment posts-depl` //To restart deployment
- `kubectl delete all  --all -n ingress-nginx` //To delete ingress-nginx

// nats local

- `kubectl get pods`
- `kubectl port-forward nats podname 4222:4222`

- `docker ps` //to see list
- `docker exec -it`
- `docker images` //Docker image list
- `docker rmi -f imageId` //Remove forcefully image from docker
