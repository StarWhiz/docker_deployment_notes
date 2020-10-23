$(document).ready(function(){
    window.localData = function(r,rr,rrr){
        if(!rrr){rrr={};};if(typeof rrr === 'string'){rrr={n:rrr}};if(!rrr.n){rrr.n='ShinobiLicenseClientSite_'+location.host}
        ii={o:localStorage.getItem(rrr.n)};try{ii.o=JSON.parse(ii.o)}catch(e){ii.o={}}
        if(!ii.o){ii.o={}}
        if(r&&rr&&!rrr.x){
            ii.o[r]=rr;
        }
        switch(rrr.x){
            case 0:
                delete(ii.o[r])
            break;
            case 1:
                delete(ii.o[r][rr])
            break;
        }
        localStorage.setItem(rrr.n,JSON.stringify(ii.o))
        return ii.o
    }
    $.createMenuItemContents = function(contents){
        var menu = Object.assign({
            title: '',
            text: '',
            type: '',
            icon: 'play',
            addShell: false,
            iconAttribute: ``,
            mediaBodyAttribute: ``,
            attribute: ``,
        },contents)
        var html = `<div ${menu.iconAttribute} class="icon ${menu.small ? 'icon-sm' : ''} icon-shape bg-gradient-${menu.type} rounded-circle text-white">
            <i class="fa fa-${menu.icon}"></i>
          </div>
          <div ${menu.mediaBodyAttribute} class="media-body ml-3 ${menu.mediaBodyClass}">
            <h5 class="heading text-${menu.type} mb-md-1">${menu.title}</h5>
            <p class="description d-none d-md-inline-block mb-0">${menu.text}</p>
          </div>`
        if(menu.addShell === true){
            html = `<a ${menu.attribute} class="${menu.class} media d-flex align-items-center">` + html + `</a>`
        }
        return html
    }
    var selectedVideoOnDemand
    var runningHlsStream
    window.setColorOfMenuItem = function(el,options){
        if(!options)options = {}
        el.find(`.text-${options.from}`).removeClass(`text-${options.from}`).addClass(`text-${options.to}`)
        el.find(`.bg-gradient-${options.from}`).removeClass(`bg-gradient-${options.from}`).addClass(`bg-gradient-${options.to}`)
    }
    window.addVodHandlersForStreamPreview = function(options){
        var video = $('#livePreview')
        var stream = options.stream
        var playlist = stream.files
        var position = options.position
        video.on('timeupdate',function(){
            var videoTimeNow = this.currentTime
            localData('playTime_' + selectedVideoOnDemand,videoTimeNow)
            var percent = videoTimeNow * 100 / this.duration
        })
        video.on('play',function(){
            localData('lastWatchedPlaying','1')
        })
        video.on('pause',function(){
            localData('lastWatchedPlaying','0')
        })
        video.on('ended',function(){
            var newPosition = position + 1
            var nextVideoLink = playlist[newPosition]
            if(nextVideoLink){
                setColorOfMenuItem($(`[playlistId="${stream.playlistId}"][launchVodFile="${nextVideoLink}"]`),{
                    from: 'success',
                    to: 'primary',
                })
                setStreamPreview(nextVideoLink,{
                    stream: stream,
                    position: newPosition,
                    currentTime: 0
                })
            }
        })
    }
    window.removeVodHandlersForStreamPreview = function(){
        var video = $('#livePreview')
        video.off('timeupdate')
        video.off('ended')
    }
    window.setStreamPreviewName = function(streamUrl,options){
        var urlParts = streamUrl.split('/')
        var filename = urlParts[urlParts.length - 1]
        $('.mediaActiveFilename').html(`<a href="${streamUrl}" target="_blank">${filename}</a>`)
        if(options.stream){
            $('.mediaTitle').text(options.stream.name)
        }
    }
    window.setStreamPreview = function(streamUrl,options){
        if(!options)options = {}
        localData('lastWatchedPlaying','0')
        setStreamPreviewName(streamUrl,options)
        var filePathParts = streamUrl.split('/')
        var filename = filePathParts[filePathParts.length - 1]
        var videoEl = $('#livePreview')
        var video = videoEl[0]
        videoEl.off('loadeddata')
        var notM3u8 = filename.indexOf('.m3u8') === -1
        if(runningHlsStream){
            runningHlsStream.destroy()
            URL.revokeObjectURL(video.src)
        }
        localData('lastWatched',{
            streamUrl: streamUrl,
            options: options
        })
        if (notM3u8 || navigator.userAgent.match(/(iPod|iPhone|iPad)/) || (navigator.userAgent.match(/(Safari)/)&&!navigator.userAgent.match('Chrome'))) {
            if(selectedVideoOnDemand !== streamUrl)video.src = streamUrl
            videoEl.on('loadeddata',function(){
                if(notM3u8){
                    var videoTimeNow = localData()['playTime_' + streamUrl]
                    video.currentTime = options.currentTime || parseFloat(videoTimeNow) || 0
                }
                if (video.paused) {
                    video.play()
                }
            })
        }else{
            runningHlsStream = new Hls();
            runningHlsStream.loadSource(streamUrl);
            runningHlsStream.attachMedia(video);
            runningHlsStream.on(Hls.Events.MANIFEST_PARSED,function() {
                if (video.paused) {
                    video.play();
                }
            })
        }
        removeVodHandlersForStreamPreview()
        if(notM3u8){
            selectedVideoOnDemand = streamUrl
            addVodHandlersForStreamPreview(options)
        }else{
            selectedVideoOnDemand = null
        }
    }
    $.fn.isInViewport = function() {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();

        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        return elementBottom > viewportTop && elementTop < viewportBottom;
    };
})
