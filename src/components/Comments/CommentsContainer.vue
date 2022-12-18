<template>
  <div class="mt-5 comments_wrapper">

    <div class="d-flex w-100 justify-content-between align-items-center px-3">
      <div>
        <span class="hover_pointer" title="Refresh"><i class="fa-solid fa-rotate-right text-primary" @click="loadComments"></i></span>
        <span class="default_cursor px-3" title="Total Comments"><i class="fa-solid fa-fire" style="color: #db431d;"></i><strong style="margin-left: 4px;">{{comments_data.count}}</strong></span>
      </div>
      <div>
        <span class="hover_pointer" title="Sort by date" v-bind:class="{'text-primary': isDateOrdering}" @click="changeOrdering('created_at')">
          Date
          <i class="fa-solid fa-caret-down" v-if="orderStartsWithMinus && isDateOrdering"></i>
          <i class="fa-solid fa-caret-up" v-else></i>
        </span>
          <span class="px-2 hover_pointer" title="Sort by username" v-bind:class="{'text-primary': isUsernameOrdering}" @click="changeOrdering('username')">
          Username
          <i class="fa-solid fa-caret-down" v-if="orderStartsWithMinus && isUsernameOrdering"></i>
          <i class="fa-solid fa-caret-up" v-else></i>
        </span>
          <span class="hover_pointer" title="Sort by email" v-bind:class="{'text-primary': isEmailOrdering}"  @click="changeOrdering('email')">
          Email
          <i class="fa-solid fa-caret-down" v-if="orderStartsWithMinus && isEmailOrdering"></i>
          <i class="fa-solid fa-caret-up" v-else></i>
        </span>
        <span class="px-3 hover_pointer" title="Add new comment" data-bs-toggle="modal" data-bs-target="#newCommentModal"><i class="fa-solid fa-circle-plus text-primary"></i></span>
      </div>
    </div>

    <Loading v-if="!loaded"/>
    <Comment
        v-else-if="loaded && comments.length"
        v-for="comment of comments"
        v-bind:comment="comment"
        v-bind:order_by="order_by"
        v-bind:reply_text="''"
        @set-comment-reply-to="setCommentReplyTo"
    />

    <h3 v-else class="text-secondary">No comments</h3>
    <Loading v-if="loadMore"/>
    <Pagination
        class="mt-3 mb-3"
        v-if="comments_data.next && !loadMore"
        v-on:load-more="loadMoreComments"
    />

    <InDevelopingModal />
    <NewCommentModal
      @reload-comments="loadComments"
      v-bind:reply_to="reply_to"
    />

  </div>
</template>

<script>
import Swal from "sweetalert2";
import Comment from "@/components/Comments/Comment";
import Loading from "@/components/Loading";
import Pagination from "@/components/Comments/Pagination";
import NewCommentModal from "@/components/Comments/NewCommentModal";
import InDevelopingModal from "@/components/InDevelopingModal";
import {api_endpoints, insertParameter} from "@/config";

export default {
  name: "Container",
  components: {
    Comment, Loading, Pagination, NewCommentModal, InDevelopingModal
  },
  data(){
    return {
      comments_data: Object,
      comments: [],
      loaded: false,
      loadMore: false,
      order_by: '-created_at',
      reply_to: null
    }
  },
  mounted() {
    this.loadComments()
  },
  methods: {
    loadComments(){
      this.loaded = false
      fetch(api_endpoints.comments + `?order_by=${this.order_by}`)
          .then(response => response.json())
          .then(json => {
            this.comments = json.results
            this.comments_data = json
            this.loaded = true
          })
          .catch(e => {
            this.loaded = true
            console.log(e)
            Swal.fire({
              icon:'error',
              title: 'Failed to load data. Try again or later'
            })
          })
    },
    loadMoreComments(){
      if(!this.comments_data.next){
        return
      }

      this.loadMore = true
      fetch(this.comments_data.next)
          .then(response => response.json())
          .then(json => {
            this.comments = this.comments.concat(json.results)
            this.comments_data = json
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
    changeOrdering(to){
      const starts_with_minus = this.order_by.startsWith('-')
      if(starts_with_minus){
        this.order_by = to
      }
      else{
        this.order_by = '-' + to
      }
      this.loadComments()
    },
    setCommentReplyTo(comment_id){
      this.reply_to = comment_id
      console.log(this.reply_to)
    }
  },
  computed: {
    isDateOrdering(){
      return this.order_by.includes('created_at')
    },
    isUsernameOrdering(){
      return this.order_by.includes('username')
    },
    isEmailOrdering(){
      return this.order_by.includes('email')
    },
    orderStartsWithMinus(){
      return this.order_by.startsWith('-')
    }
  }
}
</script>

<style scoped>

.hover_pointer:hover{
  cursor: pointer;
}

.default_cursor:hover{
  cursor: default;
}
</style>