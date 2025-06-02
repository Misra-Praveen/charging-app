import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import axiosInstance from '../utils/axios';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const center = {
  lat: 20.5937,
  lng: 78.9629,
};

const MapView = () => {
  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyB_2tv375yqzu7c4kesYuOuWs4IYrASeKY',
  });

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await axiosInstance.get('/stations');
        setStations(res.data);
      } catch (err) {
        console.error('Failed to load stations');
      }
    };
    fetchStations();
  }, []);

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5}>
      {stations.map((station) => (
        <Marker
          key={station._id}
          position={{
            lat: station.location.latitude,
            lng: station.location.longitude,
          }}
          onClick={() => setSelected(station)}
        />
      ))}

      {selected && (
        <InfoWindow
          position={{
            lat: selected.location.latitude,
            lng: selected.location.longitude,
          }}
          onCloseClick={() => setSelected(null)}
        >
          <div>
            <h3 className="font-bold">{selected.name}</h3>
            <p>Status: {selected.status}</p>
            <p>Power: {selected.powerOutput} kW</p>
            <p>Connector: {selected.connectorType}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapView;