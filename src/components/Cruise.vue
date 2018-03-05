<template>
  <div class="cruise">
    <header>
      <div class="cruise__header">
        <span class="cruise__name">
          {{ cruise.departure }}
          <template v-if="cruise.nights > 0">
            - {{ cruise.nights }} nights
          </template>
          - {{ cruise.shipName }} 
        </span>
        <span 
          class="cruise__rating"
          role="img" 
          :aria-label="cruise.stars + ' stars'"
          :title="cruise.stars + ' stars'"
        >
          {{ '⭐'.repeat(cruise.stars) }}
        </span>
        <div class="cruise__imageWrap">
          <img 
            class="cruise__image" 
            :src="'assets/images/' + cruise.logo" 
            :alt="cruise.lineName + ' logo'"
          />
        </div>
      </div>
    </header>
    <div>
    </div>
    <div 
      class="cruise__itinerary"
      v-if="cruise.itinerary"
      v-html="cruise.itinerary"
    />
    <footer>
      <div class="cruise__footer">
        <span 
          class="cruise__pricesLabel"
          v-if="Object.keys(cruise.prices).length > 0"
        >
          Cruise only from:
        </span>
        
        <ul 
          v-if="cruise.prices"
          class="cruise__prices"
        >
          <li 
            class="cruise__price"
            v-if="cruise.prices.Inside"
          >
            <span class="cruise__priceLabel">
              Inside:
            </span>
            <span class="cruise__priceAmount">
              {{ cruise.prices.Inside }}
            </span>
          </li>
          <li 
            class="cruise__price"
            v-if="cruise.prices.Outside"
          >
            <span class="cruise__priceLabel">
              Outside:
            </span>
            <span class="cruise__priceAmount">
              {{ cruise.prices.Outside }}
            </span>
          </li>
          <li 
            class="cruise__price"
            v-if="cruise.prices.Balcony"
          >
            <span class="cruise__priceLabel">
              Balcony:
            </span>
            <span class="cruise__priceAmount">
              {{ cruise.prices.Balcony }}
            </span>
          </li>
          <li 
            class="cruise__price"
            v-if="cruise.prices.Suite"
          >
            <span class="cruise__priceLabel">
              Suite:
            </span>
            <span class="cruise__priceAmount">
              {{ cruise.prices.Suite }}
            </span>
          </li>
        </ul>

        <span>
          <a 
            class="cruise__button" 
            :href="url + cruise.id"
          >
            Check Availability →
          </a>
        </span>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    cruise: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      url: "http://www.cruise.co.uk/checkAvailability.php?offerId="
    };
  }
};
</script>


<style>
.cruise {
  background: rgb(251, 251, 251);
  border: 1px solid #ccc;
  margin: 1rem 0;
  padding: 1rem;
  transition: all 250ms ease;
}

.cruise:hover {
  border-color: #6b6b6b;
  box-shadow: 0px 10px 10px 0 #ccc;
  transform: scale(1.01);
}

.cruise__name {
  color: rgb(35, 61, 144);
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-decoration: underline;
  display: inline-block;
}

.cruise__rating {
  margin: 0 1rem;
}

.cruise__image {
  max-width: 10rem;
  width: 100%;
}

.cruise__itinerary {
  margin: 1rem 0;
}

.cruise__footer {
  background: #e9ebf3;
  display: flex;
  flex-wrap: wrap;
  margin: 0 -1rem -1rem -1rem;
  padding: 1rem;
}

.cruise__prices {
  margin: 0;
  padding: 0;
}

.cruise__pricesLabel {
  color: rgb(35, 61, 144);
  text-transform: uppercase;
}

.cruise__price {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1rem;
}

.cruise__priceLabel {
  color: rgb(107, 107, 107);
  font-size: 0.75em;
}

.cruise__priceAmount {
  color: rgb(207, 0, 18);
  font-size: 1.25em;
  font-weight: bold;
}

.cruise__button {
  background: linear-gradient(rgb(50, 179, 50) 0%, rgb(0, 160, 0) 50%);
  border: 1px solid rgb(0, 160, 0);
  display: block;
  color: white;
  margin-top: 1rem;
  margin-left: auto;
  min-width: 14.5rem;
  padding: 1rem;
  text-align: center;
}

.cruise__button:hover {
  background: linear-gradient(to bottom, #00a000 50%, #b2e2b2 100%);
}

@media (min-width: 350px) {
  .cruise__image {
    width: auto;
  }
}

@media (min-width: 967px) {
  .cruise__header {
    display: flex;
    flex-wrap: wrap;
  }
  .cruise__name {
    max-width: 45rem;
  }
  .cruise__imageWrap {
    margin-left: auto;
  }
  .cruise__footer {
    display: flex;
    justify-content: space-between;
  }
  .cruise__button {
    display: inline-block;
  }
}
</style>
