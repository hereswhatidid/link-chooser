var wpLinkPopup;

(function($) {
    var inputs = {}, rivers = {}, River, Query;
    wpLinkPopup = {
        timeToTriggerRiver: 150,
        minRiverAJAXDuration: 200,
        riverBottomThreshold: 5,
        keySensitivity: 100,
        lastSearch: "",
        textarea: "",
        updateCallback: "",
        currentLink: {
            href: "",
            title: "",
            target: ""
        },
        init: function() {
            $(document.body).append($("#wpLinkChooserDialog").html());
            inputs.dialog = $("#wp-link-chooser");
            inputs.contentType = $("#wp-link-chooser .search-content-type");
            inputs.submit = $("#wp-link-chooser .wp-link-submit");
            inputs.url = $("#wp-link-chooser .url-field");
            inputs.nonce = $("#_ajax_linking_nonce");
            inputs.title = $("#wp-link-chooser .link-title-field");
            inputs.openInNewTab = $("#wp-link-chooser .link-target-checkbox");
            inputs.search = $("#wp-link-chooser .link-search-field");
            rivers.search = new River($("#wp-link-chooser .search-results"));
            rivers.recent = new River($("#wp-link-chooser .most-recent-results"));
            rivers.elements = $("#wp-link-chooser .query-results");
            inputs.dialog.keydown(wpLinkPopup.keydown);
            inputs.dialog.keyup(wpLinkPopup.keyup);
            inputs.submit.click(function(e) {
                e.preventDefault();
                wpLinkPopup.update();
            });
            $("#wp-link-chooser .wp-link-cancel").click(function(e) {
                e.preventDefault();
                wpLinkPopup.close();
            });
            $("#wp-link-chooser .internal-toggle").click(wpLinkPopup.toggleInternalLinking);
            rivers.elements.bind("river-select", wpLinkPopup.updateFields);
            inputs.search.keyup(wpLinkPopup.searchInternalLinks);
            inputs.dialog.bind("wpdialogrefresh", wpLinkPopup.refresh);
            inputs.dialog.bind("wpdialogbeforeopen", wpLinkPopup.beforeOpen);
            inputs.dialog.bind("wpdialogclose", wpLinkPopup.onClose);
        },
        beforeOpen: function() {},
        open: function(callback) {
            inputs.dialog.dialog({
                autoOpen: true,
                title: wpLinkL10nPopup.title,
                width: 480,
                height: "auto",
                dialogClass: "wp-dialog",
                modal: true
            });
            wpLinkPopup.updateCallback = callback;
        },
        refresh: function() {
            rivers.search.refresh();
            rivers.recent.refresh();
            wpLinkPopup.setDefaultValues();
            if (!rivers.recent.ul.children().length) {
                rivers.recent.ajax();
            }
        },
        close: function() {
            $("#wp-link-chooser").dialog("close");
        },
        onClose: function() {},
        getAttrs: function() {
            return {
                href: inputs.url.val(),
                title: inputs.title.val(),
                target: inputs.openInNewTab.prop("checked") ? "_blank" : ""
            };
        },
        update: function() {
            wpLinkPopup.htmlUpdate();
        },
        htmlUpdate: function() {
            var attrs;
            attrs = wpLinkPopup.getAttrs();
            if (!attrs.href || attrs.href === "http://") {
                return;
            }
            wpLinkPopup.updateCallback(attrs);
            wpLinkPopup.close();
        },
        updateFields: function(e, li, originalEvent) {
            inputs.url.val(li.children(".item-permalink").val());
            inputs.title.val(li.hasClass("no-title") ? "" : li.children(".item-title").text());
            if (originalEvent && originalEvent.type === "click") {
                inputs.url.focus();
            }
        },
        setDefaultValues: function() {
            inputs.url.val("http://");
            inputs.title.val("");
            inputs.submit.val(wpLinkL10nPopup.save);
        },
        searchInternalLinks: function() {
            var t = $(this), waiting, search = t.val();
            if (search.length > 2) {
                rivers.recent.hide();
                rivers.search.show();
                if (wpLinkPopup.lastSearch === search) {
                    return;
                }
                wpLinkPopup.lastSearch = search;
                waiting = t.parent().find(".spinner").show();
                rivers.search.change(search);
                rivers.search.ajax(function() {
                    waiting.hide();
                });
            } else {
                rivers.search.hide();
                rivers.recent.show();
            }
        },
        next: function() {
            rivers.search.next();
            rivers.recent.next();
        },
        prev: function() {
            rivers.search.prev();
            rivers.recent.prev();
        },
        keydown: function(event) {
            var fn, key = $.ui.keyCode;
            if (event.which !== key.UP && event.which !== key.DOWN) {
                return;
            }
            fn = event.which === key.UP ? "prev" : "next";
            clearInterval(wpLinkPopup.keyInterval);
            wpLinkPopup[fn]();
            wpLinkPopup.keyInterval = setInterval(wpLinkPopup[fn], wpLinkPopup.keySensitivity);
            event.preventDefault();
        },
        keyup: function(event) {
            var key = $.ui.keyCode;
            if (event.which === key.ESCAPE) {
                event.stopImmediatePropagation();
                if (!$(document).triggerHandler("wp_CloseOnEscape", [ {
                    event: event,
                    what: "wplink",
                    cb: wpLinkPopup.close
                } ])) {
                    wpLinkPopup.close();
                }
                return false;
            }
            if (event.which === key.UP || event.which === key.DOWN) {
                clearInterval(wpLinkPopup.keyInterval);
                event.preventDefault();
            }
        },
        delayedCallback: function(func, delay) {
            var timeoutTriggered, funcTriggered, funcArgs, funcContext;
            if (!delay) {
                return func;
            }
            setTimeout(function() {
                if (funcTriggered) {
                    return func.apply(funcContext, funcArgs);
                }
                timeoutTriggered = true;
            }, delay);
            return function() {
                if (timeoutTriggered) {
                    return func.apply(this, arguments);
                }
                funcArgs = arguments;
                funcContext = this;
                funcTriggered = true;
            };
        },
        toggleInternalLinking: function(event) {
            var panel = $("#wp-link-chooser .search-panel"), visible = !panel.is(":visible");
            $(this).toggleClass("toggle-arrow-active", visible);
            inputs.dialog.height("auto");
            panel.slideToggle(300, function() {
                setUserSetting("wplink", visible ? "1" : "0");
                inputs[visible ? "search" : "url"].focus();
            });
            event.preventDefault();
        }
    };
    River = function(element, search) {
        var self = this;
        this.element = element;
        this.ul = element.children("ul");
        this.waiting = element.find(".river-waiting");
        this.change(search);
        this.refresh();
        element.scroll(function() {
            self.maybeLoad();
        });
        element.delegate("li", "click", function(e) {
            self.select($(this), e);
        });
    };
    $.extend(River.prototype, {
        refresh: function() {
            this.deselect();
            this.visible = this.element.is(":visible");
        },
        show: function() {
            if (!this.visible) {
                this.deselect();
                this.element.show();
                this.visible = true;
            }
        },
        hide: function() {
            this.element.hide();
            this.visible = false;
        },
        select: function(li, event) {
            var liHeight, elHeight, liTop, elTop;
            if (li.hasClass("unselectable") || li === this.selected) {
                return;
            }
            this.deselect();
            this.selected = li.addClass("selected");
            liHeight = li.outerHeight();
            elHeight = this.element.height();
            liTop = li.position().top;
            elTop = this.element.scrollTop();
            if (liTop < 0) {
                this.element.scrollTop(elTop + liTop);
            } else if (liTop + liHeight > elHeight) {
                this.element.scrollTop(elTop + liTop - elHeight + liHeight);
            }
            this.element.trigger("river-select", [ li, event, this ]);
        },
        deselect: function() {
            if (this.selected) {
                this.selected.removeClass("selected");
            }
            this.selected = false;
        },
        prev: function() {
            if (!this.visible) {
                return;
            }
            var to;
            if (this.selected) {
                to = this.selected.prev("li");
                if (to.length) {
                    this.select(to);
                }
            }
        },
        next: function() {
            if (!this.visible) {
                return;
            }
            var to = this.selected ? this.selected.next("li") : $("li:not(.unselectable):first", this.element);
            if (to.length) {
                this.select(to);
            }
        },
        ajax: function(callback) {
            var self = this, delay = this.query.page === 1 ? 0 : wpLinkPopup.minRiverAJAXDuration, response = wpLinkPopup.delayedCallback(function(results, params) {
                self.process(results, params);
                if (callback) {
                    callback(results, params);
                }
            }, delay);
            this.query.ajax(response);
        },
        change: function(search) {
            if (this.query && this._search === search) {
                return;
            }
            this._search = search;
            this.query = new Query(search);
            this.element.scrollTop(0);
        },
        process: function(results, params) {
            var list = "", alt = true, classes = "", firstPage = params.page === 1;
            if (!results) {
                if (firstPage) {
                    list += '<li class="unselectable"><span class="item-title"><em>' + wpLinkL10nPopup.noMatchesFound + "</em></span></li>";
                }
            } else {
                $.each(results, function() {
                    classes = alt ? "alternate" : "";
                    classes += this.title ? "" : " no-title";
                    list += classes ? '<li class="' + classes + '">' : "<li>";
                    list += '<input type="hidden" class="item-permalink" value="' + this.permalink + '" />';
                    list += '<span class="item-title">';
                    list += this.title ? this.title : wpLinkL10nPopup.noTitle;
                    list += '</span><span class="item-info">' + this.info + "</span></li>";
                    alt = !alt;
                });
            }
            this.ul[firstPage ? "html" : "append"](list);
        },
        maybeLoad: function() {
            var self = this, el = this.element, bottom = el.scrollTop() + el.height();
            if (!this.query.ready() || bottom < this.ul.height() - wpLinkPopup.riverBottomThreshold) {
                return;
            }
            setTimeout(function() {
                var newTop = el.scrollTop(), newBottom = newTop + el.height();
                if (!self.query.ready() || newBottom < self.ul.height() - wpLinkPopup.riverBottomThreshold) {
                    return;
                }
                self.waiting.show();
                el.scrollTop(newTop + self.waiting.outerHeight());
                self.ajax(function() {
                    self.waiting.hide();
                });
            }, wpLinkPopup.timeToTriggerRiver);
        }
    });
    Query = function(search) {
        this.page = 1;
        this.allLoaded = false;
        this.querying = false;
        this.search = search;
    };
    $.extend(Query.prototype, {
        ready: function() {
            return !(this.querying || this.allLoaded);
        },
        ajax: function(callback) {
            var self = this, query = {
                action: "wp-link-ajax",
                contentType: inputs.contentType.val(),
                page: this.page,
                _ajax_linking_nonce: inputs.nonce.val()
            };
            if (this.search) {
                query.search = this.search;
            }
            this.querying = true;
            $.post(ajaxurl, query, function(r) {
                self.page++;
                self.querying = false;
                self.allLoaded = !r;
                callback(r, query);
            }, "json");
        }
    });
})(jQuery);

(function($) {
    "user strict";
    $(document).ready(function() {
        wpLinkPopup.init();
        $(".select-image").on("click.link-chooser", function(e) {
            e.preventDefault();
            wpLinkPopup.open(function(link) {
                $("#linkurl").val(link.href);
                $("#linktarget").val(link.target);
                $("#linktitle").val(link.title);
            });
        });
        $(".wpLinkPopup").each(function() {
            var value = $(this).data("linkvalue");
            $(this).on("click", function() {
                var field = $(this);
                wpLinkPopup.open(function(link) {
                    field.val(link[value]);
                });
            });
        });
    });
})(jQuery);