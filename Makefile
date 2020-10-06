# -include .env
# export
OWNER=graphql
IMAGE_NAME=graph-manager
QNAME=$(OWNER)/$(IMAGE_NAME)

TAG=$(QNAME):`echo $(TRAVIS_BRANCH) | sed 's/master/latest/;s/develop/unstable/' | sed 's/\//-/'`

lint:
	docker run -it --rm -v "$(PWD)/Dockerfile:/Dockerfile:ro" redcoolbeans/dockerlint

build:
	docker build -t $(TAG) .

login:
	@docker login -u "$(DOCKER_USER)" -p "$(DOCKER_PASS)"
push: login
	docker push $(TAG)

start:
	PORT=3000 npm run start:dev

test-performance:
	cat test/performance/attack.txt | vegeta attack -duration 1s | vegeta report -type=hdrplot
generate-sdk:
	npm run generate-sdk