import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function useUpdateProfile(updateInfo){

    const queryClient = useQueryClient()
    const { mutateAsync:updateProfile,isPending:isUpdating,isError ,error} = useMutation({
		
		mutationFn:async()=>{

			const res = await fetch("/api/users/update",{
				method:"POST",
				headers:{
					"Content-Type":"application/json"
				},	
				body:JSON.stringify(updateInfo),
			})
			
			const resData = await res.json()
			if(resData.failed){
              
                
				throw new Error(resData.message)
			}
		
			return resData;

		},
		onSuccess: ()=>{
			Promise.all([
				queryClient.invalidateQueries({queryKey:["authUser"]}),
				queryClient.invalidateQueries({queryKey:["visitProfile"]})
			])
		}
	})

	return {updateProfile,isUpdating,error}

}