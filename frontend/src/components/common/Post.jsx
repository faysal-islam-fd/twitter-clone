

import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import LoadingSpinner from "./LoadingSpinner";


const Post = ({ post:{createdAt,user,_id,likes,text,image,comments,_id:likePostId} }) => {
	const [comment, setComment] = useState("");
	const {data:authUser} = useQuery({queryKey:["authUser"]})
	const queryClient = useQueryClient();
	const {mutate:deletePost,isPending:isDeleting,isSuccess} = useMutation({
		mutationFn: async(postId)=>{
			const res = await fetch(`/api/posts/delete/${postId}`,{method:"DELETE"})
			const resData = await res.json();
			if(resData.failed){
				throw new Error(resData.message)
			}
			return resData
		},
			onSuccess:()=>{
				queryClient.setQueryData(["posts"], (oldData)=>{
					return oldData.filter(p => p._id  !== _id)
				})
			}
	})
	const {mutate:likeUnlike,isPending:isLiking	} = useMutation({
		mutationFn: async(id)=>{
			
			const res = await fetch("/api/posts/like/"+id,{
				method:"POST",
				headers:{
					"Content-Type":"application/json"
				},
				body: JSON.stringify({postId: _id})
			})
			const resData = await res.json();
			if(resData.failed){
		
				throw new Error(resData.message)
		
			}
			return resData
		},
		onSuccess: (updatedLikes)=>{
			queryClient.setQueryData(["posts"], (oldData)=>{
				return oldData.map(p =>{
					if(p._id === _id){
						return {...p, likes: updatedLikes}
					}
					return p;
				});
			})
		}
	})
	const {mutate:commentPost,isPending:isCommenting} = useMutation({
		mutationFn : async({commentData,commentId})=>{
			
			const res = await fetch("/api/posts/comment/"+commentId,{
				method:"POST",
				headers:{
					"Content-Type":"application/json"
				},
				body: JSON.stringify(commentData)
			})
			const data = await res.json()
			if(data.failed){
				throw new Error(data.message)
			}
			return data;
		},
		onSuccess : (updatedData)=>{
			
		
			queryClient.setQueryData(["posts"], (oldData)=>{
				return oldData.map(p =>{
					if(p._id === _id){
						return {...p, comments: updatedData}
					}
					return p;
				});
			})
		}
	})

	const isLiked =  likes.includes(authUser._id);
	if(isSuccess){
		queryClient.invalidateQueries(["posts"])
		
	}
	const isMyPost = authUser._id === user._id;

	const oldDate = new Date(createdAt);
	const newDate = new Date();
	const diffInMilliseconds =  newDate - oldDate;
	const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
	
	const diffInHours = Math.floor(diffInMinutes / 60);
	const diffInDays = Math.floor(diffInHours / 24);
	const formattedDate = diffInDays > 0 ? `${diffInDays}d` : diffInHours > 0 ? `${diffInHours}h` : `${diffInMinutes}m`;


	const handleDeletePost = (postId) => {
		
		deletePost(postId)
	};

	const handlePostComment = (e) => {
		e.preventDefault();
		setComment("")
		if(isCommenting) return;
		
		commentPost({commentData:{text:comment},commentId:_id})

	};

	const handleLikePost = (e,id) => {
		if(isLiking) return;
		likeUnlike(id)

	};


	return (
		<>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
				<div className='avatar'>
					<Link to={`/profile/${user.username}`} className='w-8 rounded-full overflow-hidden'>
						<img src={user.profileImage || "/avatar-placeholder.png"} />
					</Link>
				</div>
				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center'>
						<Link to={`/profile/${user.username}`} className='font-bold'>
							{user.fullname}
						</Link>
						<span className='text-gray-700 flex gap-1 text-sm'>
							<Link to={`/profile/${user.username}`}>@{user.username}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								{!isDeleting && (<FaTrash className='cursor-pointer hover:text-red-500' onClick={()=>handleDeletePost(_id)} />)}
									{isDeleting && <Loa:iddingSpinner size="sm" />}
							</span>
						)}
					</div>
					<div className='flex flex-col gap-3 overflow-hidden'>
						<span>{text}</span>
						{image && (
							<img
								src={image}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)}
					</div>
					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + _id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{comments.length}
								</span>
							</div>
							{/* We're using Modal Component from DaisyUI */}
							<dialog id={`comments_modal${_id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{comments?.comments?.length === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 Be the first one 😉
											</p>
										)}
										{comments.map((comment) =>{
											
											return(
												<div key={comment._id} className='flex gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={comment?.user.profileImage || "/avatar-placeholder.png"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{comment.user.fullname}</span>
														<span className='text-gray-700 text-sm'>
															@{comment?.user.username}
														</span>
													</div>
													<div className='text-sm'>{comment.text}</div>
												</div>
											</div>
											)
										})}
									</div>
									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
											{isCommenting ? (
												<span className='loading loading-spinner loading-md'></span>
											) : (
												"Post"
											)}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							<div className='flex gap-1 items-center group cursor-pointer'>
								<BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
								<span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
							</div>
			
							<div className='flex gap-1 items-center group cursor-pointer' onClick={(e)=>handleLikePost(e,likePostId)}>
							{isLiking && <LoadingSpinner size='sm' />}
								{!isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />
								)}

								<span
									className={`text-sm  group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : "text-slate-500"
									}`}
								>
									{likes.length}
								</span>
							</div>
						</div>
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Post;