(function () {
  'use strict';

  // Store a local reference to jQuery and Underscorea.
  var $ = window.jQuery;
  var _ = window._;

  var Hangover = window.Hangover = function (el, anchor, options) {
    _.extend(this, options);
    _.bindAll(this, '_mouseover', '_mouseout', '_focus', '_blur', '_click');
    this.hovered = false;
    this.focused = false;
    this.clicked = false;
    this._buildContainer().setElement(el).setAnchor(anchor);
  };

  _.extend(Hangover.prototype, {

    // The position of $el relative to the $anchor.
    position: 'top',

    // If set to true, $el can be hovered over without being hidden.
    hoverable: false,

    // Display $el when $anchor is hovered.
    hover: true,

    // Display $el when $anchor gains focus.
    focus: true,

    // Display $el when $anchor is clicked.
    click: false,

    // Preserve $el's listeners and data by using detach instead of remove.
    preserve: false,

    // Set the $el property.
    setElement: function (el) {
      this.$container.empty().append(this.$el = el instanceof $ ? el : $(el));
      return this;
    },

    // Set up the $el container.
    _buildContainer: function () {
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
      (this.$anchor = anchor instanceof $ ? anchor : $(anchor)).on({
        mouseover: this._mouseover,
        mouseout: this._mouseout,
        focus: this._focus,
        blur: this._blur
      });
      $(document).click(this._click);
      return this;
    },

    // Show the $container.
    show: function () {
      this.$anchor.parent().append(this.$container);
      this._move();
      return this;
    },

    // Hide the $container.
    hide: function () {
      this.$container[this.preserve ? 'detach' : 'remove']();
      this.hovered = this.focused = this.clicked = false;
      return this;
    },

    _move: function () {
      var $container = this.$container;
      var $anchor = this.$anchor;
      var $parent = $anchor.parent();
      var divWidth = $container.outerWidth();
      var divHeight = $container.outerHeight();
      var parentScrollLeft = $parent.scrollLeft();
      var parentScrollTop = $parent.scrollTop();
      var tPosition = $anchor.position();
      var tLeft = tPosition.left + parentScrollLeft + parseInt($anchor.css('marginLeft'));
      var tTop = tPosition.top + parentScrollTop + parseInt($anchor.css('marginTop'));
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
        mouseover: this._mouseover,
        mouseout: this._mouseout,
        focus: this._focus,
        blur: this._blur
      });
      $(document).off(this._click);
      return this;
    },

    _mouseover: function () {
      if (!this.hover) return;
      this.hovered = true;
      this.show();
    },

    _mouseout: function () {
      if (!this.hover) return;
      this.hovered = false;
      if ((!this.click || !this.clicked) &&
          (!this.focus || !this.focused)) {
        this.hide();
      }
    },

    _focus: function () {
      if (!this.focus) return;
      this.focused = true;
      this.show();
    },

    _blur: function () {
      if (!this.focus) return;
      this.focused = false;
      if ((!this.click || !this.clicked) &&
          (!this.hover || !this.hovered)) {
        this.hide();
      }
    },

    _click: function (ev) {
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
