class APIFilters {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    search() {
      const keywordForSearch = this.queryStr.keyword
        ? {
            title: {
              $regex: this.queryStr.keyword,
              $options: "i",
            }
          }
        : {};
      this.query = this.query.find({ ...keywordForSearch }).sort({registeredUsers: 1});
      return this;
    }
  
    filter(){
        let copyStr = {...this.queryStr} // this will provide value of object this.queryStr not address
        const removeFields= ["keyword", "page", "limit"] // that stuff we don't want in our query
        removeFields.forEach(key=>delete copyStr[key]); // to clean our copyStr from given words
        // For Price And Reviews etc firstly make string so we can make gt to $gt in mongodb
        let queryStr = JSON.stringify(copyStr);
         // in queryStr where you find gt convert it to $gt
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key)=>`$${key}`);
        // now parse this query string to make object and then pass it as query to find method
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
  
  // RPP -> Result Per Page
    pagenation(RPP){
        let currentPage = this.queryStr.page || 1; // page is provided in url(query) if not then by default ist page
        let skippedProducts = (currentPage - 1)*RPP; // skip how much products are displayed on previous pages
  
        this.query = this.query.limit(RPP).skip(skippedProducts);
        return this;
    }
  }
  
  module.exports = APIFilters;