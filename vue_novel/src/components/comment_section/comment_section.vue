<template>

    <div class="comment_section">
        <h1 class="section_title">评论</h1>
        <div class="section_content">
            <div class="user_avatar"><img :src="user_avatar_img"></div>
            <div class="user_input_box">
                <div class="user_input" ref="user_input"><textarea placeholder="请友善的评论哦" v-model="message"
                        ref="input_box_1" id="input_box_1"
                        :style="{ height: auto_height + 'px', 'min-height': min_height + 'px' }"></textarea></div>
                <div class="user_input_btn" @click="send_msg">发送</div>
            </div>
        </div>
        <div class="root_comment_box" v-for="(main_item, main_index) in main_temp" :key="main_index">
            <comment_box :message="get_message" :main_msgarr="main_item" @messages="update_msg"
                @click_message="update_msg" @click="test(main_index, main_index, 'main')"></comment_box>
            <div class="sub_comment_box">
                <comment_box :message="get_message" :main_msgarr="item" @messages="update_msg"
                    @click_message="update_msg" v-for="(item, index) in main_temp[main_index].sub" :key="index"
                    @click="test(index, main_index, 'sub')"></comment_box>
            </div>

        </div>

    </div>
</template>
<script lang="ts">
// eslint-disable-next-line no-unused-vars
import { ref, onMounted, onUnmounted } from 'vue';
import comment_box from './comment_box/comment_box.vue'

export default {
    name: 'comment_section',
    components: {
        comment_box,
    },
    data() {
        return {

        }
    },
}
</script>
<script setup lang="ts">
//自动拓宽逻辑
let user_avatar_img = ref('../../../image/87328997_p0.jpg');
let auto_height = ref('auto');
let user_input = ref<HTMLTextAreaElement | null>(null);
let input_box_1 = ref<HTMLTextAreaElement | null>(null);
let min_height = ref(50);
let get_message = ref('');
function auto_text_h() {
    if (user_input.value) {
        var width = user_input.value.offsetWidth;
        var heigth = user_input.value.offsetHeight;
        var content_text = input_box_1.value?.value;
        get_message.value = content_text;
        var line_height = 18 * 1.5;
        let text_len = content_text?.length;
        let font_width = get_fontwidth(content_text);
        let max_line = Math.floor(width / font_width);
        if (text_len >= max_line) {
            auto_height.value = 'auto';
            min_height.value = line_height * Math.ceil(text_len / max_line) - 18.5;
        }
        else if (text_len <= max_line)
            min_height.value = 40;
    }
}
function get_fontwidth(text: string | any[]) {
    var font_width: number;
    const span = document.createElement('span');
    span.style.fontFamily = 'Microsoft YaHei';
    span.style.fontSize = '18px';
    span.textContent = text;
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'nowrap';
    document.body.appendChild(span);
    font_width = span.getBoundingClientRect().width;
    document.body.removeChild(span);
    return font_width / text.length;
}
onMounted(() => {
    auto_text_h();
    input_box_1.value?.addEventListener('input', () => {
        auto_text_h();
    });
    window.addEventListener('resize', () => {
        auto_text_h();
    });
})

//评论发送逻辑
let root_msg = ref('');
let main_message = ref([{ 'index': '0', 'main': root_msg, 'sub': ['sub消息1', 'sub消息2'] }, { 'index': '1', 'main': '消息2', 'sub': ['sub2消息1', 'sub消息2'] }]);
const main_temp = main_message.value;
const temp_message = ref();
let main_msgarr = ref(['消息1']);
let sub_msgarr = ref(['消息2', '消息3']);
let message = ref('');
//操控主评论数据结构函数
function set_data(index: number, content: any, sub_content: any) {
    var temp = main_message.value
    index = temp.length;
    temp.push({ 'index': index, 'main': content, 'sub': sub_content });
    main_message.value = temp;
}
function set_update_data(content: string, sub_content: string, arr_list_index: string | number, dist_name: any, dist_arr_index: string | number) {
    var temp = main_message.value;
    temp[arr_list_index].main = content;
    temp[arr_list_index].sub[dist_arr_index] = sub_content;
    main_message.value = temp;
}

//主评论发送逻辑
function send_msg() {
    main_msgarr.value.push(get_message.value);
    message.value = '';
    console.log(main_msgarr.value);
    var msg_test = main_message.value.filter(msg => msg !== null && msg !== undefined);
    console.log(msg_test[0].main);
    console.log(msg_test[0].sub[0])
    // update_msg('main',main_msgarr.value);
}
//子评论发送逻辑
let sub_message = ref([]);
function update_msg(msg_text: string) {
    //删除所有为空的数组
    sub_msgarr.value = sub_msgarr.value.filter(msg => msg !== null && msg !== undefined && msg !== '');
    sub_msgarr.value.push(msg_text);
    console.log('消息传入' + msg_text);
    console.log('main' + sub_msgarr.value);
    fetch('/api/getMessage',
        {
            method:'post',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({'key':'消息完成完成连接','message':sub_msgarr.value}),
        }  
    )
    .then(res=>res.json())
    .then(data=>{
        root_msg.value=data.message;
    })
    .catch(error=>{
        console.log(error);
    })
}
function test(index: number, main_index: any, item: string) {
    console.log(index + ' ' + item);
    console.log('main_index ' + main_index);
    let temp = main_message.value;
    if (item == 'main') {
        temp_message.value = (temp[main_index].main);
        console.log(temp[main_index].main);
        console.log(temp_message.value + 'test');
        for (let value of temp) {
            console.log(value);
        }
    }
    else if (item == 'sub') {
        console.log(temp[main_index].sub[index]);
        for (let value of temp[main_index].sub) {
            console.log(value);
        }
    }
}
onMounted(() => {
    fetch('/api/listen', { // 使用代理的路径
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: 'test' }),
    })
        .then(async response=>{
            const data = await response.json();
            root_msg.value = data.message;
            console.log(data);
        })
        .then(data => console.log(data))
        .catch(error => console.error(error))
})

</script>
<style scoped>
.comment_section {
    display: flex;
    margin-top: 20px;
    padding: 5px;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid red;
    border-radius: 10px;
    background-color: rgba(233, 233, 233, 1);
    flex-direction: column;
}

.section_title {
    display: flex;
    margin-top: 5px;

}

.user_avatar {
    display: flex;
    width: 50px;
    height: 50px;
    overflow: hidden;
    border-radius: 50%;
}

.user_avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.section_content {
    display: flex;
    width: 100%;
    min-height: 50px;
    height: auto;
    align-items: center;
    margin-top: 5px;
    padding: 5px;
    position: relative;
    border: 1px solid red;
    justify-content: space-between;
}

.user_input_box {
    display: flex;
    align-items: center;
    margin-left: 10px;
    margin-right: 10px;
    padding: 5px;
    width: 90%;
}

.user_input {
    display: flex;
    width: 100%;
    height: auto;
    min-height: 40px;
    background-color: rgba(211, 211, 211, 1);
    border-radius: 15px;
    overflow: hidden;
}

.user_input textarea {
    width: 100%;
    height: auto;
    border: none;
    margin-top: auto;
    margin-bottom: auto;
    outline: none;
    resize: none;
    background: transparent;
    font-size: 18px;
    line-height: 1.5;
    overflow-y: hidden;
}

#input_box_1::placeholder {
    display: flex;
    align-content: center;
    align-items: center;
    margin-top: auto;
    margin-bottom: auto;
}

.user_input_btn {
    display: flex;
    width: 100px;
    height: 40px;
    align-items: center;
    margin-left: 20px;
    background-color: rgba(0, 150, 250, 1);
    border-radius: 25px;
    align-items: center;
    justify-content: center;
}

.user_input_btn:hover {
    cursor: pointer;
    background-color: rgba(0, 150, 250, 0.8);
}

.root_comment_box {
    display: flex;
    margin-top: 10px;
    width: 90%;
    flex-direction: column;
    height: auto;
}

.sub_comment_box {
    display: flex;
    margin-left: 50px;
    height: auto;
    flex-direction: column;
}
</style>: string | any[] | null | undefined: number: any: any: string: string: string | number: any: string | number:
string: string: string(: any)