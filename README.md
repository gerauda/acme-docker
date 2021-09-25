# Project Acme #

Description:

- E-COMMERCE application
- A front end (native mobile application or WeChat mini app)
- Backend is an API that does users, products and payments management

Backend can de deployed:

- Services like Heroku, Elastic Beanstalk (AWS), Back4App
- Elastic container registry (AWS, Alicloud), K8S, HC Nomad
- Virtual machine (EC2, ECS, etc..) + Dockerized app ✅

By the end of this workshop you will have:

- Sample Express API project that is Dockerized
- Configured CI with GitHub Actions and GitHub Container Registry

## Creating Express app

#### 1. Create GitHub repo ####

#### 2. Run the following #### 

> mkdir app
> cd app
> docker run -exec -it -v $(pwd):/app -p 3000:3000 node:alpine sh
> cd /app
> npm init
> npm install express --save

#### 3. Create index.js #### 

> const express = require('express')
> const app = express()
> app.get('/', (req, res) => {
>   res.send('Hello World!')
> })
> app.listen(3000, () => {
>   console.log(`Example app listening at http://localhost:3000`)
> })

#### 4. Run the app #### 

> node index.js 

Example app listening at http://localhost:3000


## Build and run docker image locally ##

#### 1. Add a docker file Dockerfile

> FROM node:alpine
> WORKDIR /app
> COPY . .
> RUN npm install
> EXPOSE 3000
> ENTRYPOINT ["node", "index.js"]

#### 2. Build an image

> docker build -t devops101:latest .

#### 3. Run an image

> docker run -p 3000:3000 devops101:latest


## GitHub Actions and Container Registry ##

- CI/CD that is integrated right into your code repository
- Features and pricing: https://github.com/features/actions
- Syntax: https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions
- Find actions: https://github.com/marketplace?type=actions

You can:

- run tests
- build/package your code
- release
 
## Building your first action

1. Add a file .github/workflows/build.yml

```
on: [push]
name: build
jobs:
  build:
    name: Build docker image
    runs-on: ubuntu-latest
    steps:
      - name: Determine Docker image tag and name
        id: determine_tag
        run: |
          ref="${GITHUB_REF##*/}"
          echo "::set-output name=ref::$(echo $ref)"
          echo "::set-output name=image_full::$(echo ghcr.io/${GITHUB_REPOSITORY}:$ref)"
          
      - name: Checkout repo
        uses: actions/checkout@v2
        with:
          fetch-depth: "0"

      - name: Build docker image
        run: docker build -t ${{ steps.determine_tag.outputs.image_full }} .
        working-directory: ./app

      - name: Push docker image
        run: |
          echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ilyamochalov --password-stdin
          docker push ${{ steps.determine_tag.outputs.image_full }}
```
