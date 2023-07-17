import React, { useEffect, useRef, useState } from 'react';
import Details from './Details';
const axios = require('axios');
const MyForm = () => {
  const mapRef = useRef(null);
  const [formData, setFormData] = useState(null);
  const photoInputRef = useRef(null);
  const addressInputRef = useRef(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [serviceAreas, setServiceAreas] = useState([]);
  const [requestTypes, setrequestTypes] = useState([]);
  useEffect(() => {
    let map, marker;

    const initMap = () => {
      const initialLocation = { lat: 14.5995, lng: 120.9842 }; // Initial map center coordinates (Manila, PH)

      map = new window.google.maps.Map(mapRef.current, {
        center: initialLocation,
        zoom: 8,
        apiKey: 'AIzaSyCwOk2ajrdAX4hDcjm1iQHEOg20Ziii9w8'
      });

      marker = new window.google.maps.Marker({
        map: map,
        draggable: true
      });

      // Add event listener to update marker position and address when the marker is dragged
      window.google.maps.event.addListener(marker, 'dragend', function () {
        updateMarkerPosition(marker.getPosition());
        geocodeLatLng(marker.getPosition());
      });

      // Add event listener to update marker position and address when the map is clicked
      window.google.maps.event.addListener(map, 'click', function (event) {
        marker.setPosition(event.latLng);
        updateMarkerPosition(event.latLng);
        geocodeLatLng(event.latLng);
      });

      const geocoder = new window.google.maps.Geocoder();

  // Add event listener to update marker position and address when the marker is clicked
  window.google.maps.event.addListener(marker, 'click', function () {
    const position = marker.getPosition();

    // Reverse geocode the marker's position to get the address details
    geocoder.geocode({ location: position }, function (results, status) {
      if (status === 'OK' && results[0]) {
        const clickedResult = results[0];

        // Find the building name component in the address details
        const buildingNameComponent = clickedResult.address_components.find(component =>
          component.types.includes('premise')
        );

        // Use the building name if available, otherwise use the formatted address
        const clickedBuildingName = buildingNameComponent ? buildingNameComponent.long_name : clickedResult.formatted_address;

        // Update the address input value with the clicked building name
        addressInputRef.current.value = clickedBuildingName;
      }
    });
  });
      
      photoInputRef.current.addEventListener('change', handleImagePreview);
      addressInputRef.current.addEventListener('input', handleAddressInput);
    };

    const handleAddressInput = () => {
      const address = addressInputRef.current.value;
      geocodeAddress(address);
    };

    const handleImagePreview = () => {
    const files = Array.from(photoInputRef.current.files);
    if (files.length > 7) {
      setErrorMessage('You can only select a maximum of 7 files .');
      setIsSubmitDisabled(true);
      return;
    }

    const allowedSize = 200 * 1024; // 200KB
    const invalidFiles = files.filter(file => file.size > allowedSize);

    if (invalidFiles.length > 0) {
      setErrorMessage('File size limit exceeded. Please select files up to 200KB.');
      setIsSubmitDisabled(true);
      return;
    }

    setErrorMessage('');
    setIsSubmitDisabled(false);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    
  };
 
    const updateMarkerPosition = (latLng) => {
      document.getElementById('latitude').value = latLng.lat();
      document.getElementById('longitude').value = latLng.lng();
      map.setCenter(latLng);
      map.setZoom(16);
    };

    const geocodeLatLng = (latLng) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, function (results, status) {
        if (status === 'OK' && results[0]) {
          document.getElementById('address').value = results[0].formatted_address;
        }

    
      });
    };
    const geocodeAddress = (address) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, function (results, status) {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          marker.setPosition(location);
          updateMarkerPosition(location);
        }
      });
    };  

    initMap();
  }, []);

  useEffect(() => {
    const fetchServiceAreas = async () => {
      try {
        const response = await fetch('https://pythonproject1-tdrgvnyuhq-uc.a.run.app/getServiceArea');
        if (!response.ok) {
          throw new Error('Failed to fetch service areas');
        }
        const data = await response.json();
        console.log(data)
        setServiceAreas(data);
      } catch (error) {
        console.log('Error fetching service areas:', error);
      }
    };
    fetchServiceAreas();
  }, []);

  useEffect(() => {
    const fetchServiceAreas = async () => {
      try {
        const response = await fetch('https://pythonproject1-tdrgvnyuhq-uc.a.run.app/getRequestType');
        if (!response.ok) {
          throw new Error('Failed to fetch service areas');
        }
        const data = await response.json();
        console.log(data)
        setrequestTypes(data);
      } catch (error) {
        console.log('Error fetching service areas:', error);
      }
    };
    fetchServiceAreas();
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
  
    // Retrieve the form data
    const [serviceArea, user_id] = event.target.elements.serviceArea.value.split('|');
    const name = event.target.elements.name.value;
    const email = event.target.elements.email.value;
    const phone = event.target.elements.phone.value;
    const requestType = event.target.elements.requestType.value;
    const requestDesc = event.target.elements.requestDesc.value;
    const title = event.target.elements.title.value;
    const address = event.target.elements.address.value;
    const latitude = event.target.elements.latitude.value;
    const longitude = event.target.elements.longitude.value;
  
    const formData = new FormData(event.target);
    const photos = Array.from(formData.getAll('photos'));
    const requestData = {
      name,
      email,
      phone,
      requestDesc,
      title,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      user_id: parseInt(user_id),
      service_id: parseInt(serviceArea),
      request_type_id: parseInt(requestType)
    };

    try {
      const response = await fetch('https://pythonproject1-tdrgvnyuhq-uc.a.run.app/createRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit the form');
      }
      

      const responseText = await response.text();

      if (responseText === 'Success') {
        // Form submitted successfully
        setFormData({
         
            name,
            email,
            phone,
            requestType,
            requestDesc,
            serviceArea,
            title,
            address,
            latitude,
            longitude,
            photos,
            user_id
          
          // formData values...
        });
       
      }
      const data = await response.json();
      console.log(data);
      // Handle the response data if needed
    } catch (error) {
      console.log('Error submitting the form:', error);
      // Handle the error if needed
    }
    // Set the form data in the component state along with image previews
    setFormData({
      name,
      email,
      phone,
      requestType,
      requestDesc,
      serviceArea,
      title,
      address,
      latitude,
      longitude,
      photos,
      user_id
    });
    console.log(formData)
    // Update the image previews
    const previews = photos.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  return (
    
    <div>
      
      {formData ? (
        <Details formData={formData} />
      ) : (
        <form id="myForm" onSubmit={handleSubmit}>
          <div className='container'><img className='leftimg' alt='RequestHQ_logo' src="/RequestHQ_logo.svg" /><img className='rightimg' alt='Cohesis_logo' src="/Cohesis_logo.svg"/></div>
        <div className='line'></div>
        <h1>Send a Request</h1>
        
        <h2>Requester Information</h2>
        

        <input type="text" id="name" placeholder='Full Name *' name="name" required /><br /><br />

        <input type="email" id="email" placeholder='Email *' name="email" required /><br /><br />

        <input type="tel" id="phone" placeholder='Phone *' name="phone" required /><br /><br />
        <h2 htmlFor="address">Location</h2>
        <input type="text" id="address" placeholder='Enter an address *' name="address" required ref={addressInputRef} />

        <div id="map" ref={mapRef}></div>

        <input type="hidden" id="latitude" name="latitude" />
        <input type="hidden" id="longitude" name="longitude" />


        <h2>Request Details</h2>
        
        <input type="text" id="title" placeholder='Title *' name="title" required /><br /><br />

        <select id="serviceArea" name="serviceArea" required>
  <option value="">Select Service Area *</option>
  {serviceAreas.map((area) => (
    <option key={area.id} value={`${area.id}|${area.user_id}`}>
      {area.title}
    </option>
  ))}
</select>

<select id="requestType" name="requestType" required>
  <option value="">Select Request Type *</option>
  {requestTypes.map((area) => (
    <option key={area.id} value={area.id}>
      {area.title}
    </option>
  ))}
</select>

        <textarea type="text" id="requestDesc" placeholder='Description *' name="requestDesc" required /><br /><br />

        <h2 id='attach'>Attach Photos</h2>
        <input type="file" id="photos" name="photos" multiple ref={photoInputRef} /><br /><br />
        <div style={{ color: 'red' }}>{errorMessage}</div> {/* Display error message */}
        <div id='attachments'>

          {imagePreviews.map((preview, index) => (
            <img id='pics' key={index} src={preview} alt={`Preview ${index}`} width="200" height="200" />
          ))}
        </div>
        <div style={{ display: 'flex' }}>
        <input type="submit" id='submitButton' value="Submit" disabled={isSubmitDisabled} />
        </div><br /><br />

        </form>
      )}
    </div>
  );
};

export default MyForm;