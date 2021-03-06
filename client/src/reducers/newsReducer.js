const newsReducer = (state, action) => {
  switch (action.type) {
    case "INCREASE_PAGE":
      return { ...state, page: state.page + 1, isLazy: true };
    case "SET_ARTICLES":
      return {
        ...state,
        articles: [...state.articles, ...action.articles],
        isLazy: false
      };
    default:
      throw new Error();
  }
};

export default newsReducer;
