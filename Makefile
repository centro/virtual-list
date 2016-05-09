NAME    = virtual-list
SOURCES = $(wildcard src/*.jsx)

default: $(NAME)

$(NAME): dist/$(NAME).js

dist/$(NAME).js: $(SOURCES)
	./node_modules/.bin/webpack --output-filename $@

watch:
	./node_modules/.bin/webpack --watch --output-filename dist/virtual-list.js

clean:
	rm -rf ./dist

.PHONY: $(NAME) default clean dist
