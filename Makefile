NAME    = virtual-list
SOURCES = $(wildcard src/*.jsx)

default: $(NAME)

$(NAME): dist/$(NAME).js

dist/$(NAME).js: $(SOURCES)
	./node_modules/.bin/webpack --output-filename $@

clean:
	rm -rf ./dist

.PHONY: $(NAME) default clean dist
