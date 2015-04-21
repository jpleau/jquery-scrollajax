#!/usr/bin/make -f

PROGRAM=jquery-scrollajax
VERSION=0.0.1
SRC=src/jquery.scrollajax.js
DIST=dist/jquery.scrollajax.min.js

all:
	echo -e "`head -n 5 $(SRC)`\n */" > $(DIST)
	uglifyjs $(SRC) >> $(DIST)
	sed -i 's,%VERSION%,$(VERSION),g' $(DIST)

dist:
	(git ls-files *; ls dist/*) | egrep -v "(Makefile|watch)" | \
	tar -czT - --transform 's,^,$(PROGRAM)-$(VERSION)/,' \
	-f $(PROGRAM)-$(VERSION).tar.gz
	

.PHONY: all watch dist
