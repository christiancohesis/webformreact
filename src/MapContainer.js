import React, { Component } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  marginTop: '10px',
  marginBottom: '10px'
};

const center = {
  lat: 14.5995,
  lng: 120.9842
};

const MapContainer = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyCwOk2ajrdAX4hDcjm1iQHEOg20Ziii9w8"> // Replace with your actual API key
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={8}>
        <Marker draggable={true} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;