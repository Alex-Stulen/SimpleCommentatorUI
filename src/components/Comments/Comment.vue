<template>
  <div class="card mt-3" :id="'id_comment_'+ comment.id" v-bind:class="{m_left_40: is_reply}">
    <div class="card-body">
      <div class="row p-2">
        <div class="col-sm-11 d-flex flex-wrap justify-content-between align-items-center">
          <img class="avatar_img" :src="generataUserAvatarUrl" alt="Avatar">
          <div class="text-start">
              <h5 class="m-0"><strong>@{{comment.username}}</strong></h5>
              <i class="px-2">{{comment.email}}</i>
          </div>
          <time>{{getHumanCommentTime}}</time>
          <span><a href="#" data-bs-toggle="modal" data-bs-target="#InDevelopingModal"><i class="fa-regular fa-hashtag text-primary"></i></a></span>
          <span><a href="#" data-bs-toggle="modal" data-bs-target="#InDevelopingModal"><i class="fa-regular fa-bookmark text-primary"></i></a></span>
          <span><a href="#" data-bs-toggle="modal" data-bs-target="#InDevelopingModal"><i class="fa-regular fa-heart text-primary"></i></a></span>
          <span><a href="#" data-bs-toggle="modal" data-bs-target="#InDevelopingModal"><i class="fa-regular fa-circle-up text-primary"></i></a></span>
        </div>
        <div class="col-sm-1  d-flex justify-content-end align-items-center">
          <span><i class="fa-solid fa-fire" style="color: #db431d;"></i></span>
          <span class="text-secondary fs-5 mx-1">{{comment.answers_count}}</span>
        </div>
      </div>
      <hr>
      <p v-if="reply_text" class="text-start reply_border px-1 mx-2" v-html="reply_text"></p>
      <br v-if="reply_text">
      <div class="row px-3">
        <div class="col-sm-12 text-start">
          <p v-html="comment.text"></p>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 text-end">
          <span class="hover_pointer mx-3" title="Click here to reply to a comment" data-bs-toggle="modal" data-bs-target="#newCommentModal" @click="$emit('set-comment-reply-to', comment.id)">Comment <i class="fa-solid fa-comment text-warning"></i></span>
          <span class="show_answers hover_pointer" v-if="comment.answers_count && show_replies_btn" @click="loadReplies">Show answers ({{comment.answers_count}})</span>
          <span class="hide_answers hover_pointer" v-else-if="comment.answers_count && !show_replies_btn" @click="hideReplies(comment.id)">Hide answers ({{comment.answers_count}})</span>
          <span class="text-secondary" v-else>No answers</span>
        </div>
      </div>

      <div class="text-start" v-if="comment.file">
        <i class="fa-solid fa-paperclip text-secondary" title="Attached files"></i>
        <div v-if="comment.file.is_image">
          <ImagePreview
              v-bind:sources="[absoluteImageUrl(comment.file.src)]"
              v-bind:toggler="true"
              v-bind:img_src="absoluteImageUrl(comment.file.src)"
          />
        </div>
        <div v-else>
          <a :href="absoluteImageUrl(comment.file.src)" target="_blank" title="Click to open file"><i class="fa-regular fa-file-lines text-primary fs-2"></i></a>
        </div>
      </div>

    </div>
  </div>
  <div>
    <Comment
        v-if="loaded && replies.length"
        v-for="reply of replies"
        v-bind:comment="reply"
        v-bind:order_by="order_by"
        v-bind:reply_text="sliceReplyText(comment.text)"
        v-bind:is_reply="true"
        @set-comment-reply-to="$emit('set-comment-reply-to', reply.id)"
    />
    <Loading v-if="!loaded || loadMore"/>
    <Pagination
        class="mt-3 mb-3"
        v-if="replies_data.next && !loadMore"
        v-on:load-more="loadMoreReplies"
    />
  </div>
</template>

<script>
import Swal from "sweetalert2";
import Loading from "@/components/Loading";
import Pagination from "@/components/Comments/Pagination";
import ImagePreview from "@/components/ImagePreview";
import {api_endpoints, insertParameter, buildAbsoluteUrl} from "@/config";

export default {
  name: "Comment",
  props: {
    comment: Object,
    order_by: '-created_at',
    reply_text: '',
    is_reply: false,
  },
  components: {
    Loading, Pagination, ImagePreview
  },
  data(){
    return {
      loaded: true,
      replies: [],
      replies_data: Object,
      loadMore: false,
      show_replies_btn: true
    }
  },
  computed: {
    getHumanCommentTime(){
      const datetime = new Date(+this.comment.created_at * 1000)
      const date = datetime.toLocaleDateString("ua-UA", {year: '2-digit', month: '2-digit', day: '2-digit'})
      const time = datetime.toLocaleTimeString("ua-UA", {hour: '2-digit', minute:'2-digit'})
      return `${date} at ${time}`
    },
    generataUserAvatarUrl(){
      return 'https://ui-avatars.com/api/?name=' + this.comment.username + '&background=random'
    },
  },
  methods: {
    getLoadRepliesUrl(comment_id){
      return insertParameter(api_endpoints.get_comment_replies, '$id', comment_id) + '?order_by=' + this.order_by
    },
    loadReplies(){
      this.loaded = false
      this.show_replies_btn = false
      fetch(this.getLoadRepliesUrl(this.comment.id))
          .then(response => response.json())
          .then(json => {
            this.replies = json.results
            this.replies_data = json
            this.loaded = true
          })
          .catch(e => {
            this.loaded = true
            Swal.fire({
              icon:'error',
              title: 'Failed to load data. Try again or later'
            })
          })
    },
    hideReplies(comment_id){
      this.show_replies_btn = true
      this.replies = this.replies.filter(r => !r.reply_to === comment_id)
    },
    loadMoreReplies(){
      if(!this.replies_data.next){
        return
      }

      this.loadMore = true
      fetch(this.replies_data.next)
          .then(response => response.json())
          .then(json => {
            this.replies = this.replies.concat(json.results)
            this.replies_data = json
            this.loadMore = false
          })
          .catch(e => {
            this.loadMore = false
            Swal.fire({
              icon:'error',
              title: 'Failed to load data. Try again or later'
            })
          })

    },
    sliceReplyText(text){
      return text.slice(0, 100)
    },
    absoluteImageUrl(relative_src){
      return buildAbsoluteUrl(relative_src)
    }
  }
}
</script>

<style scoped>
.hover_pointer:hover{
  cursor: pointer;
}

.avatar_img{
  border-radius: 50%;
}

.show_answers{
  text-decoration: none;
  color: #0d6efd;
}

.show_answers:hover{
  cursor: pointer;
  color: #347cf4;
}

.hide_answers{
  text-decoration: none;
  color: #7d7d7d;
}

.hide_answers:hover{
  cursor: pointer;
  color: #c4c4c4;
}

.reply_border{
  border-left: 3px solid #0d6efd;
}

.m_left_40{
  margin-left: 40px;
}
</style>