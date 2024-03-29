document.querySelector('.artwork_look_more').addEventListener('click', function(event){
    var text=event.target.innerText;
    console.log(text);
})

//显示更多作品滚动实现
// 第一个滚动容器
const leftBtn = document.querySelector('.artwork_leftbtn');
const rightBtn = document.querySelector('.artwork_rightbtn');
const otherWorkImage = document.querySelector('.other_work_image');

leftBtn.addEventListener('click', function() {
    scrollContainerArtwork(-100);
});

rightBtn.addEventListener('click', function() {
    scrollContainerArtwork(100);
});

function scrollContainerArtwork(scrollOffset) {
    otherWorkImage.scrollBy({ left: scrollOffset, behavior: 'smooth' });
}

// 第二个滚动容器
const leftBtnUser = document.querySelector('.artwork_thumbnail_leftbtn');
const rightBtnUser = document.querySelector('.artwork_thumbnail_rightbtn');

leftBtnUser.addEventListener('click', function() {
    scrollContainerUser(-200);
});

rightBtnUser.addEventListener('click', function() {
    scrollContainerUser(200);
});

function scrollContainerUser(scrollOffset) {
    var otherWorkImageUser = document.querySelector('.artwork_thumbnail_img');
    otherWorkImageUser.scrollBy({ left: scrollOffset, behavior: 'smooth' });
}

var comment_section_input_box_textarea = document.querySelector('.textarea');
var lineHeight = parseInt(window.getComputedStyle(comment_section_input_box_textarea).lineHeight);
var charHeight = 16;
var maxHeight = 300;

comment_section_input_box_textarea.addEventListener('input', function() {
    comment_section_input_box_textarea.style.height = 'auto';
    var scrollHeight = comment_section_input_box_textarea.scrollHeight;
    comment_section_input_box_textarea.style.height = Math.min(scrollHeight - charHeight, maxHeight) + 'px';
});
//回复的查看和收起
document.addEventListener("DOMContentLoaded", function() {  
    var commentSection = document.querySelector(".comment_section");  
    commentSection.addEventListener("click", function(event) {  
        var target = event.target;  
        // 如果点击的是“查看回复”按钮  
        if (target.classList.contains("show_reply")) {  
            var showReplyButton = target;  
            var replyMessage = showReplyButton.nextElementSibling;  
            if (replyMessage) {  
                showReplyButton.style.display = "none";  
                replyMessage.style.display = "block";  
            }  
        }  
        // 如果点击的是“收起回复”按钮  
        else if (target.classList.contains("collapse_reply")) {  
            var collapseReplyButton = target;  
            var replyContainer = collapseReplyButton.closest('.reply_message');  
            if (replyContainer) {  
                var showReplyButton = replyContainer.previousElementSibling;  
                if (showReplyButton && showReplyButton.classList.contains("show_reply")) {  
                    replyContainer.style.display = "none";  
                    showReplyButton.style.display = "block";  
                }  
            }  
        }  
    });  
});
//收藏状态切换
document.addEventListener("DOMContentLoaded", function() {
    var collectionButtons = document.querySelectorAll(".related_artwork_collection");

    collectionButtons.forEach(function(button) {
        button.addEventListener("click", function(event) {
            var target = event.target;

            // 检查点击的是否为相关的按钮元素
            if (target.closest('.related_artwork_collection')) {
                // 切换按钮的显示状态
                var btn1 = this.querySelector('.collection_btn1');
                var btn2 = this.querySelector('.collection_btn2');

                if (btn2.style.display === "none") {
                    btn2.style.display = "block";
                } else {
                    btn2.style.display = "none";
                }
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {  
    var followingButtons = document.querySelectorAll(".following_btn");  
    followingButtons.forEach(function (button) {  
        button.addEventListener("click", function (event) {  
            var btn_text = this.innerText; // 直接使用this来获取按钮的文本  
            if (btn_text == '关注') {  
                this.innerText = '已关注';  
                this.style.backgroundColor = 'rgba(172,172,172,0.8)'; 
            } else if (btn_text == '已关注') {  
                this.innerText = '关注';  
                this.style.backgroundColor = 'rgba(0, 173, 254, 0.8)'; 
            }  
        });  
    });  
});

document.addEventListener("DOMContentLoaded", function() {
    var following_btn=document.querySelectorAll('.artwork_following');
    following_btn.forEach(function(btn){
        btn.addEventListener('click',function(){
            var btn_text=this.innerText;
            if(btn_text=='关注'){
                this.innerText='已关注';
                this.style.backgroundColor='rgba(172,172,172,0.8)';
            }
            else if(btn_text=='已关注'){
                this.innerText='关注';
                this.style.backgroundColor='rgba(0, 173, 254, 0.8)';
            }
        });
    });
}
);

//互动按钮的状态切换
document.addEventListener("DOMContentLoaded", function() {
   var like_btn=document.querySelectorAll('.user_art_work_interaction_like');
   like_btn.forEach(function(btn){
      btn.addEventListener('click',function(){
        var like_img_divs = this.querySelectorAll('.user_art_work_interaction_like_img');
        var like_text_div = this.querySelector('.user_art_work_interaction_like_text');
        // 切换图片的显示状态
        like_img_divs.forEach(function(img_div) {
            if (img_div.style.display === 'block') {
                img_div.style.display = 'none';
            } else {
                img_div.style.display = 'block';
            }
        });
        // 根据第一张图片是否显示来决定是否要设置文字样式
        if (like_img_divs[0].style.display === 'block') {
            like_text_div.style = '';
        } else {
            like_text_div.style.color = 'rgba(12, 138, 241, 1)';
        }
      });
   });
});

document.addEventListener("DOMContentLoaded", function() {
    var collection_btns = document.querySelectorAll('.user_art_work_interaction_collection');
    
    collection_btns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var second_img_div = this.querySelector('.user_art_work_interaction_collection_img:nth-child(2)');

            // 切换第二张图片的显示状态
            if (second_img_div.style.display === 'block' || second_img_div.style.display === '') {
                second_img_div.style.display = 'none';
            } else {
                second_img_div.style.display = 'block';
            }
        });
    });
});
// 复制链接按钮点击事件
document.addEventListener("DOMContentLoaded", function() {  
    var copylink_btn = document.querySelector('.user_art_work_interaction_collection_img_copylink');  
    copylink_btn.addEventListener('click', function() {  
        var page_link = window.location.href;  
          
        // 使用 Clipboard API 复制文本到剪贴板  
        navigator.clipboard.writeText(page_link)  
            .then(function() {  
                alert('链接已复制'); 
            })  
            .catch(function(error) {  
                console.error('复制链接时出错:', error);  
                alert('复制链接失败，请手动复制。'); 
            });  
    });  
});

//分享按钮下拉列表
document.addEventListener("DOMContentLoaded", function() {
    var share_btn = document.querySelector('.user_art_work_interaction_share_img');
    var share_dropdown = document.querySelector('.user_art_work_interaction_collection_img_dropdown');

    share_btn.addEventListener('click', function(event) {
        event.stopPropagation(); 
        toggleDropdown();
    });

    // 点击其他位置时隐藏下拉列表
    document.addEventListener('click', function(event) {
        var target = event.target;
        if (!target.closest('.user_art_work_interaction_share')) {
            share_dropdown.style.display = 'none';
        }
    });

    // 切换下拉列表的显示状态
    function toggleDropdown() {
        if (share_dropdown.style.display === 'block') {
            share_dropdown.style.display = 'none';
        } else {
            share_dropdown.style.display = 'block';
        }
    }
});

//查看更多按钮的显示切换以及功能实现
document.addEventListener("DOMContentLoaded", function() {
    var hiddenElement = document.querySelector('.user_art_work_hidden');
    var moreButton = document.querySelector('.artwork_look_more');

    // 检查图片元素的数量并设置按钮的显示状态
    function checkImageCount() {
        var imageCount = hiddenElement.querySelectorAll('img').length;
        if (imageCount === 0) {
            moreButton.style.display = 'none';
        } else {
            moreButton.style.display = '';
        }
    }

    // 页面加载时检查图片元素的数量
    checkImageCount();

    // 当有图片元素被添加或移除时重新检查图片数量
    var observer = new MutationObserver(checkImageCount);
    observer.observe(hiddenElement, { childList: true });

});


