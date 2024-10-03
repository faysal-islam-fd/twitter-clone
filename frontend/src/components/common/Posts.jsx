// import Post from "./Post";
import { useEffect } from "react";
import PostSkeleton from "../skeletons/PostSkeleton";
// import { POSTS } from "../../utils/db/dummy";
import Post from "./Post";
import { useQuery } from "@tanstack/react-query";

const Posts = ({feedType}) => {

	function getPostsEndPoint(){
		if(feedType === "forYou"){
			return "/api/posts/all"
		}
		if(feedType === "following"){
			return "/api/posts/following"
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
		}
	})
	useEffect(()=>{
		refetch()
	},[feedType,refetch])
	console.log(data)
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
			{!isLoading && data && !isRefetching(
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