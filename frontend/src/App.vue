<template>
  <div id="app">
    <h1>Coffee Lookup</h1>
    <h2>Click to find coffee shops within 1km (0.6 miles)</h2>
    <p>A serverless geo-search demo - Learn more at <a href="https://serverlessland.com">Serverless Land</a>.</p>
    <GmapMap
      :center="center"
      :zoom="14"
      map-type-id="roadmap"
      style="width: 100%; height: 700px"
      @click="updateCenter"
    >
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"        
      />
      <GmapCircle
      :center="center"
      :radius="1000"
      :options="{fillColor:'blue',fillOpacity:0.1}"
      />
    </GmapMap>
    <p>Lat: {{ center.lat }} / Lng: {{ center.lng }}</p>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'app',
  data() {
    return {
      // default to NYC
      center: { lat: 40.7769099, lng: -73.9822532 },
      markers: [],
      places: [],
      currentPlace: null,
      searching: false
    }
  },
  // Learn more about this component at https://www.npmjs.com/package/vue2-google-maps
  methods: {
    async updateCenter(event) {

      // Cancel if already searching
      if (this.searching) return
      this.searching = true

      // Remove existing markers
      this.markers = []

      this.center = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      }

      try {
        const results = await axios({
          method: 'post',
          url: 'https://tpmp7vk381.execute-api.us-east-1.amazonaws.com/locations',
          data: {
            lat: this.center.lat,
            lng: this.center.lng
          }
        })
        console.log(results)
        results.data.map((location) => {
          const point = JSON.parse(location.geoJson.S)
          const marker = {
            lat: point.coordinates[1],
            lng: point.coordinates[0]
          }
          this.markers.push({ position: marker })
        })
      } catch (err) {
        console.error('Error: ', err)
      }
      
      this.searching = false
    }
  }  
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
