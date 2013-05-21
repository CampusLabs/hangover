(function () {
  'use strict';

  // Store a local reference to jQuery and Underscorea.
  var $ = window.jQuery;
  var _ = window._;

  var Hangover = window.Hangover = function (el, anchor, options) {
    _.extend(this, options);
    _.bindAll(this,
      'onMouseover', 'onMouseout', 'onFocus', 'onBlur', 'onClick'
    );
    _.each(['hover', 'focus', 'click'], function (type) {
      this[type] = !!~this.action.indexOf(type);
    }, this);
    this.hovered = this.focused = this.clicked = false;
    this.buildContainer().setElement(el).setAnchor(anchor);
  };

  _.extend(Hangover.prototype, {

    // The position of $el relative to the $anchor.
    position: 'top',

    // Display $el the following actions occur (hover, focus, and/or click).
    action: 'hover focus',

    // Preserve $el's listeners and data by using detach instead of remove.
    preserve: false,

    // Set the $el property.
    setElement: function (el) {
      this.$container.empty().append(this.$el = el instanceof $ ? el : $(el));
      return this;
    },

    // Set up the $el container.
    buildContainer: function () {
      this.$container = $('<div>')
        .addClass('js-hangover-container ' +
          _.map(this.position.split(' '), function (dir) {
            return 'js-hangover-' + dir;
          }).join(' ')
        )
        .on('click', 'js-hover-hide', this._hide);
      return this;
    },

    // Set the $anchor property.
    setAnchor: function (anchor) {
      if (this.$anchor) this.$anchor.css('position', null);
      (this.$anchor = anchor instanceof $ ? anchor : $(anchor)).on({
        mouseover: this.onMouseover,
        mouseout: this.onMouseout,
        focus: this.onFocus,
        blur: this.onBlur
      }).css('position', 'relative');
      $(document).click(this.onClick);
      return this;
    },

    // Show the $container.
    show: function () {
      this.$anchor.parent().append(this.$container);
      this.move();
      return this;
    },

    // Hide the $container.
    hide: function () {
      this.$container[this.preserve ? 'detach' : 'remove']();
      this.hovered = this.focused = this.clicked = false;
      return this;
    },

    move: function () {
      var $container = this.$container;
      var $anchor = this.$anchor;
      var divWidth = $container.outerWidth();
      var divHeight = $container.outerHeight();
      var tPosition = $anchor.position();
      var tLeft = tPosition.left + parseInt($anchor.css('marginLeft'), 10);
      var tTop = tPosition.top + parseInt($anchor.css('marginTop'), 10);
      var tWidth = $anchor.outerWidth();
      var tHeight = $anchor.outerHeight();
      var position = {
        left: tLeft,
        top: tTop
      };
      switch (this.position) {
      case 'top':
        position.left += (tWidth - divWidth) / 2;
        position.top -= divHeight;
        break;
      case 'right':
        position.left += tWidth;
        position.top += (tHeight - divHeight) / 2;
        break;
      case 'bottom':
        position.left += (tWidth - divWidth) / 2;
        position.top += tHeight;
        break;
      case 'left':
        position.left -= divWidth;
        position.top += (tHeight - divHeight) / 2;
        break;
      }
      this.$container.css(position);
      return this;
    },

    destroy: function () {
      this.hide();
      this.$anchor.off({
        mouseover: this.onMouseover,
        mouseout: this.onMouseout,
        focus: this.onFocus,
        blur: this.onBlur
      });
      $(document).off(this.onClick);
      return this;
    },

    onMouseover: function () {
      if (!this.hover) return;
      this.hovered = true;
      this.show();
    },

    onMouseout: function () {
      if (!this.hover) return;
      this.hovered = false;
      if ((!this.click || !this.clicked) &&
          (!this.focus || !this.focused)) {
        this.hide();
      }
    },

    onFocus: function () {
      if (!this.focus) return;
      this.focused = true;
      this.show();
    },

    onBlur: function () {
      if (!this.focus) return;
      this.focused = false;
      if ((!this.click || !this.clicked) &&
          (!this.hover || !this.hovered)) {
        this.hide();
      }
    },

    onClick: function (ev) {
      if (!this.click) return;
      if (!this.clicked) {
        var anchorClicked =
          ev.target === this.$anchor[0] ||
          $.contains(this.$anchor[0], ev.target);
        if (!anchorClicked) return;
        this.clicked = true;
        return this.show();
      }
      if ($.contains(this.$container[0], ev.target)) return;
      this.clicked = false;
      return this.hide();
    }
  });
})();
