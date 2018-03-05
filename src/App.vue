<template>
  <div>
    <Header />
    <div class="wrapper">
      <p class="count" v-if="results.length">
        There are <b>{{ results.length }}</b> results - Showing <b>{{ visibileResults.length }}</b>
      </p>
      <div class="results">
        <Cruise 
          v-for="(result, index) in visibileResults" 
          :cruise="result"
          :key="index" 
          v-if="result.departure"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Cruise from "./components/Cruise.vue";
import axios from "axios";

export default {
  name: "app",
  components: {
    Header,
    Cruise
  },
  data() {
    return {
      results: [],
      visibileResults: [],
      page: 0,
      perPage: 10
    };
  },
  methods: {
    fetchCruises() {
      axios // has more browser support than the native fetch function
        .get("/assets/data/enhanced.json")
        .then(({ data }) => this.onFetchCruises(data))
        .catch(err => console.error(err));
    },
    onFetchCruises(data) {
      const sorted = data.sort((a, b) => a.date > b.date);
      this.results = sorted;
      this.displayCruises();
    },
    displayCruises() {
      const start = this.page * this.perPage;
      const end = start + this.perPage - 1;
      for (let i = start; i <= end; i++) {
        if (this.results[i]) {
          this.visibileResults.push(this.results[i]);
        }
      }
    },
    displayMoreCruises() {
      if (this.visibileResults.length === this.results.length) return;
      this.page++;
      this.displayCruises();
    }
  },
  created() {
    this.fetchCruises();
  },
  mounted() {
    window.onscroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        this.displayMoreCruises();
      }
    };
  }
};
</script>

<style>
html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body {
  font-family: Roboto, Verdana, Arial, helvetica, sans-serif;
}

img {
  max-width: 100%;
}

.wrapper {
  margin: 0 auto;
  max-width: 64rem;
}

.count {
  margin: 1rem 0;
  text-align: center;
}

.results {
  margin: 1rem 0;
}
</style>
