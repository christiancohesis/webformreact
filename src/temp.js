import React, { useEffect, useRef, useState } from 'react';
import Details from './Details';

const MyForm = () => {
  const mapRef = useRef(null);
  const [formData, setFormData] = useState(null);
  const photoInputRef = useRef(null);
  const [imagePreviews, setImagePreviews] = useState([]);

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
      
      photoInputRef.current.addEventListener('change', handleImagePreview);
    };
 
    const updateMarkerPosition = (latLng) => {
      document.getElementById('latitude').value = latLng.lat();
      document.getElementById('longitude').value = latLng.lng();
    };

    const geocodeLatLng = (latLng) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, function (results, status) {
        if (status === 'OK' && results[0]) {
          document.getElementById('address').value = results[0].formatted_address;
        }
      });
    };

    initMap();
  }, []);

  const handleImagePreview = () => {
    const files = Array.from(photoInputRef.current.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  }

const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Retrieve the form data
    const name = event.target.elements.name.value;
    const email = event.target.elements.email.value;
    const phone = event.target.elements.phone.value;
    const requestType = event.target.elements.requestType.value;
    const requestDesc = event.target.elements.requestDesc.value;
    const serviceArea = event.target.elements.serviceArea.value;
    const title = event.target.elements.title.value;
    const address = event.target.elements.address.value;
    const latitude = event.target.elements.latitude.value;
    const longitude = event.target.elements.longitude.value;
    
    const formData = new FormData(event.target);
    const photos = formData.getAll('photos');
    console.log('Photos:', photos);
    // Set the form data in the component state
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
      longitude
    });
  };

  return (
    <div>
      {formData ? (
        <Details formData={formData} />
      ) : (
        <form id="myForm" onSubmit={handleSubmit}>
        <h1>Send a Request</h1>
        <h2>Request Details</h2>
        
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" required /><br /><br />

        <label htmlFor="serviceArea">Service Area:</label>
        <input type="text" id="serviceArea" name="serviceArea" required /><br /><br />

        <label htmlFor="requestType">Request Type:</label>
        <input type="text" id="requestType" name="requestType" required /><br /><br />

        <label htmlFor="requestDesc">Request Description:</label>
        <input type="text" id="requestDesc" name="requestDesc" required /><br /><br />

        <h2>Attach Photos</h2>
        <label htmlFor="photos">Photos:</label>
        <input type="file" id="photos" name="photos" multiple ref={photoInputRef} /><br /><br />

        <div>

          {imagePreviews.map((preview, index) => (
            <img key={index} src={preview} alt={`Preview ${index}`} width="200" height="200" />
          ))}
        </div>

        <h2 htmlFor="address">Location</h2>
        <input type="text" id="address" name="address" ref={addressInputRef} required />

        <div id="map" ref={mapRef}></div>

        <input type="hidden" id="latitude" name="latitude" />
        <input type="hidden" id="longitude" name="longitude" />

        <h2>Requester Information</h2>
        
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required /><br /><br />

        <label htmlFor="email">Email Address:</label>
        <input type="email" id="email" name="email" required /><br /><br />

        <label htmlFor="phone">Phone Number:</label>
        <input type="tel" id="phone" name="phone" required /><br /><br />

        <input type="submit" value="Submit" /><br /><br />
        </form>
      )}
    </div>
  );
};

export default MyForm;