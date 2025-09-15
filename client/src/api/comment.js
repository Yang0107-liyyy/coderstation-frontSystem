import request from "./request";

/**
 * 根据问答的 id 获取对应的评论
 * @param {*} id 
 * @param {*} params 分页对应的数据
 * @returns 
 */
export function getIssueCommentById(id, params) {
  return request({
    url: `/api/comment/issuecomment/${id}`,
    method: "GET",
    params: {
      ...params,
    },
  });
}

/**
 * 根据 bookId 获取该书籍所对应的评论
 * @param {*} id 
 * @param {*} params 
 * @returns 
 */
export function getBookCommentById(id, params) {
  return request({
    url: `/api/comment/bookcomment/${id}`,
    method: "GET",
    params: {
      ...params,
    },
  });
}

/**
 * 提交评论
 */
export function addComment(newComment) {
  return request({
    url: "/api/comment",
    method: "POST",
    data: newComment
  })
}