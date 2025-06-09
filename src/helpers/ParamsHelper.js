class ParamsHelper {
  getParamsFromUrl () {
    const queryString = window.location.search
    const params = new URLSearchParams(queryString)
    return params
  }
}

export default new ParamsHelper()
