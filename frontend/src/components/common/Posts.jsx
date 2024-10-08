// import Post from "./Post";
import { useEffect } from "react";
import PostSkeleton from "../skeletons/PostSkeleton";
// import { POSTS } from "../../utils/db/dummy";
import Post from "./Post";
import { useQuery } from "@tanstack/react-query";


const 	Posts = ({feedType,username,userId}) => {

	
	function getPostsEndPoint(){
		
		
		if(feedType === "forYou"){
			
			return "/api/posts/all"
		}
		if(feedType === "following"){
			return "/api/posts/following"
		}
		if(feedType==="posts"){
			return `/api/posts/user/${username}`
		}
		if(feedType === "likes"){
			return `/api/posts/likes/${userId}`
		}
	}
	
	const {isLoading,isError,error,data,isRefetching,refetch } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			const res = await fetch(getPostsEndPoint());
			const resData = await res.json();
		
			if (resData.failed) {
				throw new Error(resData.message);
			}
			return resData;
		},
		retry:false
	})
	useEffect(()=>{
		refetch()
	},[feedType,refetch])
	
	if(isError){
		return <p>{error.message}</p>
	}
	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && data?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && data && !isRefetching && (
				<div>
					{data.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;