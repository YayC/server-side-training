/**
This file contains all the Javascript code to power the app. You'll
need to add extra functions and the Mixpanel integration code in this
file.
**/

function trackCorgiView(chosenCorgi) {
    mixpanel.track('Got Corgi', {corgi_url: chosenCorgi})
    mixpanel.people.increment('Lifetime Corgis')
}

// changes the image to a random corgi via hardcoded links
function getCorgi() {
    var corgis = [
        "http://cdn.akc.org/corgi-4.jpg",
        "https://scontent-ort2-2.xx.fbcdn.net/v/t1.0-9/13417489_1727894694118512_6809314816731714698_n.jpg?oh=805de1de7648ae057f1a7af6852525eb&oe=5A642741",
        "http://cdn3-www.dogtime.com/assets/uploads/2016/08/corgi-puppy-4.jpg",
        "http://mosaicsandcorgis.com/wp-content/uploads/2015/06/DSC_9511.jpg",
        "http://cdn1-www.dogtime.com/assets/uploads/gallery/cardigan-welsh-corgi/olderderp-6_680-453.jpg",
        "http://cdn2-www.dogtime.com/assets/uploads/2016/08/corgi-puppy-6.jpg",
        "http://3.bp.blogspot.com/-AXnXOPZgqMk/Un-xCBAa4gI/AAAAAAAAsWA/z_lZsvDoCRk/s1600/derpstages.jpg",
        "http://1.bp.blogspot.com/-5HJshY2CgMs/Un-x7BxZfcI/AAAAAAAAsWM/kwRcF-G11Fo/s640/derpoc.jpg",
        "http://buzzsharer.com/wp-content/uploads/2015/06/jumping-corgi-winter.jpg",
        "http://4fluffypaws.com/wp-content/uploads/2017/02/corgi-jumping-off-dock.png",
        "http://4fluffypaws.com/wp-content/uploads/2017/02/corgi-jumping-off-dock.png",
        "http://adogbreeds.com/wp-content/uploads/2012/12/Pembroke-Welsh-Corgi-Puppies-Play-at-Black-Gravel.jpg",
        "https://assets3.thrillist.com/v1/image/2444807/size/tmg-article_tall;jpeg_quality=20.jpg",
        "https://gfp-2a3tnpzj.stackpathdns.com/wp-content/uploads/2016/05/Buffy_photo-4-600x600.jpg",
        "http://r.ddmcdn.com/w_624/s_f/o_1/cx_0/cy_17/cw_624/ch_416/APL/uploads/2014/06/corgi-01-625x450.jpg"
    ];
    var randomNumber = Math.floor((Math.random() * corgis.length));
    var chosenCorgi = corgis[randomNumber];
    document.getElementById("corgi_image").src = chosenCorgi;
    trackCorgiView(chosenCorgi)
}

function mixpanelReady(){
    if($("#user_id")){
        mixpanel.identify($("#user_id").html())
    }

    var pageTitle = document.getElementsByTagName("title")[0].innerHTML
    mixpanel.track("Page Viewed", {page: pageTitle})

    if(pageTitle === 'index-logged-in') {
        // A new corgi image is shown by default on this page
        chosenCorgi = document.getElementById("corgi_image").src
        trackCorgiView(chosenCorgi)
    }

    if($("#login-form")){
        $("#login-form").submit(function(){
            mixpanel.track('Submitted Login Form', {username: $("#id_username").val()})
            return true
        })
    }

    if($("#signup-form")){
        $("#mp_distinct_id").val(mixpanel.get_distinct_id())
        $("#signup-form").submit(function(){
            mixpanel.track('Submitted Signup Form', {username: $("#id_username").val()})
            return true
        })
    }

    if($("a#logout-button")){

        $("a#logout-button").click(function(e){
            e.preventDefault()
            mixpanel.track("Logout Clicked")
            mixpanel.reset()
            window.location.href = $("a#logout-button")[0].href
        })
    }
}

// this check probably isn't necessary if you just place the mixpanel snippet above where app.js is loaded
function waitForMixpanel(){
    if(mixpanel && mixpanel.__loaded){
        console.log(mixpanel.persistence.properties())
        mixpanelReady()
    } else {
        setTimeout(waitForMixpanel, 50)
    }
}

$(document).ready(function(){
    waitForMixpanel()
})
