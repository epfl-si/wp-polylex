# polylex Makefile
SHELL := /bin/bash
VERSION=$(shell ./change-version.sh -pv)

.PHONY: help
help:
	@echo "Main:"
	@echo "  make help               — Display this help"
	@echo "  make meteor             — Run application polylex on localhost"
	@echo "Utilities:"
	@echo "  make print-env          — Print the environment variables"
	@echo "  make test               — Run test suite"
	@echo "  make apidoc             — Refresh API documentation"
	@echo "  make prettier           — Prettier all the things"
	@echo "  make prettier-check     — Check if prettier need to be run"
	@echo "Publication and deployment:"
	@echo "  make publish            — To build, tag and push new Image"
	@echo "  make deploy-test        — To deploy on test environment"
	@echo "  make deploy-prod        — To deploy on prod environment"
	@echo "Development:"
	@echo "  make dev-up             — Brings up Docker services for development"
	@echo "  make dev-build          — Build Docker services for development"
	@echo "  make dev-build-force    — Force build Docker services for development"
	@echo "  make dev-exec           — Enter the meteor container"
	@echo "  make dev-cli            — Install polylex-cli in the meteor container"

# To add all variable to your shell, use
# export $(xargs < /keybase/team/epfl_polylex/env);
check-env:
ifeq ($(wildcard /keybase/team/epfl_polylex/env),)
	@echo "Be sure to have access to /keybase/team/epfl_polylex/env"
	@exit 1
else
include /keybase/team/epfl_polylex/env
endif

print-env: check-env
	@echo "POLYLEX_DB_PASSWORD_TEST=${POLYLEX_DB_PASSWORD_TEST}"
	@echo "POLYLEX_DB_PASSWORD_PROD=${POLYLEX_DB_PASSWORD_PROD}"
	@echo "MOCHA_TIMEOUT=${MOCHA_TIMEOUT}"

.PHONY: meteor
meteor: check-env
	@echo '**** Start meteor: ****'
	cd app/; meteor --settings meteor-settings.json

test: check-env
	@echo '**** Run test: ****'
	@cd app; env MOCHA_TIMEOUT=$$MOCHA_TIMEOUT TEST_WATCH=1 meteor test --full-app --driver-package meteortesting:mocha --port 3888

.PHONY: prettier-check
prettier-check:
	npx prettier --write "app/{client,private,server,tests}/**/*.{js,jsx}"
	npx prettier --check "cli/**/*.js"

.PHONY: prettier
prettier:
	npx prettier --write "app/{client,private,server,tests}/**/*.{js,jsx}"
	npx prettier --write "cli/**/*.js"

.PHONY: build
build:
	@echo '**** Start build: ****'
	docker build -t epflsi/polylex .
	@echo '**** End build: ****'

.PHONY: tag
tag:
	@echo '**** Start tag: ****'
	docker tag epflsi/polylex:latest epflsi/polylex:latest
	@echo '**** End tag: ****'

.PHONY: push
push:
	@echo '**** Start push: ****'
	docker push epflsi/polylex:latest
	docker push epflsi/polylex:latest
	@echo '**** End push: ****'

.PHONY: deploy-test
deploy-test:
	@echo '**** Start deploy: ****'
	if [ -z "$$(oc project)" ]; then \
		echo "pas loggué"; \
		oc login; \
	else \
		echo "loggué"; \
	fi
	cd ansible/; \
	export $$(xargs < /keybase/team/epfl_polylex/env); \
	ansible-playbook playbook.yml -i hosts-test
	@echo '**** End deploy: ****'

.PHONY: deploy-prod
deploy-prod:
	@echo '**** Start deploy: ****'
	if [ -z "$$(oc project)" ]; then \
		echo "pas loggué"; \
		oc login; \
	else \
		echo "loggué"; \
	fi
	cd ansible/; \
	export $$(xargs < /keybase/team/epfl_polylex/env); \
	ansible-playbook playbook.yml -i hosts-prod
	@echo '**** End deploy: ****'

.PHONY: publish
publish:
	$(MAKE) build
	$(MAKE) tag
	$(MAKE) push


################################################################################
# Targets for development purpose only                                         #
################################################################################
.PHONY: dev-up
dev-up:
	@docker-compose -f docker-compose-dev.yml up

.PHONY: dev-build
dev-build:
	@docker-compose -f docker-compose-dev.yml build

.PHONY: dev-build-force
dev-build-force:
	@docker-compose -f docker-compose-dev.yml build --force-rm --no-cache --pull

.PHONY: dev-exec
dev-exec:
	@docker exec -it --user root polylex_meteor bash

.PHONY: dev-cli
dev-cli:
	@docker exec -it --user root polylex_meteor /bin/bash -c "cd /src/cli && npm install && npm install -g ./ && cd /src/ && polylex-cli --help"

.PHONY: dev-data
dev-data: dev-cli
	@docker exec -it --user root polylex_meteor /bin/bash -c "cd /src && polylex-cli load-tests-data-on-localhost-db"