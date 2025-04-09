import { useState, useEffect } from 'react';



const useCurrentLocation = () => {

    const [location,setLocation]=useState(null)
    const [error, setError] = useState(null);

    useEffect(()=>{
        if(!navigator.geolocation){
            setError('Geolocation not supported');
            return;
        }

        navigator.geolocation.getCurrentPosition(

            (position)=>{
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    
                })
            },
            
      (error) => {
        setLocation(prev => ({ ...prev, error: error.message }));
      }
        )
    },[])
 return {location,error};
}

export default useCurrentLocation
