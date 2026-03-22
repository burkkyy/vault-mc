import axios from "axios"
import MockAdapter from "axios-mock-adapter"

export const mockedAxios = new MockAdapter(axios)

export default mockedAxios
