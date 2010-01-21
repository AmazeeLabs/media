(function ($) {
  namespace('media.browser.plugin');
  
  Drupal.media.browser.plugin.library = function(mediaBrowser, options) {
    
    return {
      mediaFiles: [],
      init: function() {
        tabset = mediaBrowser.getTabset();
        tabset.tabs('add', '#library', 'Library');
        var that = this;
        mediaBrowser.listen('tabs.show', function (e, id) {
          if (id == 'library') {
            // This is kinda rough, I'm not sure who should delegate what here.
            mediaBrowser.getActivePanel().addClass('throbber');
            mediaBrowser.getActivePanel().html('');
            //mediaBrowser.getActivePanel().addClass('throbber');
            
            // Assumes we have to refresh everytime.
            // Remove any existing content
            mediaBrowser.getActivePanel().append('<ul></ul>');
            that.browser = $('ul', mediaBrowser.getActivePanel());
            that.browser.addClass('clearfix');
            that.getMedia();
          }
        });
      },
      
      getConditions: function () {
        return {};
        //return this.settings.conditions;
      },
    
      getMedia: function() {
        var that = this;
        var callback = mediaBrowser.getCallbackUrl('getMedia');
        var params = {
          conditions: this.getConditions()
        };
        
        jQuery.get(
          callback,
          params,
          function(data, status) {
            that.mediaFiles = data;
            that.render();
          },
          'json'
        );
      },
      
      render: function() {
        var that = this;
        mediaBrowser.getActivePanel().removeClass('throbber');
        //this.browser.html('');
        if(this.mediaFiles.length < 1) {
          return;
        }
        
        for (var m in this.mediaFiles) {
          mediaFile = this.mediaFiles[m];

          var listItem = jQuery('<li></li>').appendTo(this.browser)
            .attr('id', 'media-file-' + mediaFile.fid)
            .addClass('media-file');
          
          var imgLink = jQuery('<a href="#"></a>').appendTo(listItem)
            .html(mediaFile.preview)
            .bind('click', mediaFile, function(e) {
              // Notify the main browser
              //this.selectedMedia = mediaFile;
              $('.media-file').removeClass('selected');
              $(this).parent().addClass('selected');
              mediaBrowser.notify('mediaSelected', {mediaFiles: [e.data]});
              //that.settings.onSelect(mediaFile);
              return false;
            });
        }
      }
  };
};

  Drupal.media.browser.register('library', Drupal.media.browser.plugin.library);
})(jQuery);