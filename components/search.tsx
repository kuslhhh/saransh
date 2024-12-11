"use client";
import React, { useState, useEffect } from "react";
import { useLazyGetSummaryQuery } from "@/utils/services/article";
import Loading from "../app/loading";
import { motion } from "framer-motion";

const Search = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);

  // RTK lazy query
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  const [readMore, setReadMore] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const articlesFromLocalStorage = localStorage.getItem("articles");
    if (articlesFromLocalStorage) {
      setAllArticles(JSON.parse(articlesFromLocalStorage));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );

    if (existingArticle) {
      return setArticle(existingArticle);
    }

    try {
      const { data } = await getSummary({ articleUrl: article.url });
      if (data?.summary) {
        const newArticle = { ...article, summary: data.summary };
        const updatedAllArticles = [newArticle, ...allArticles];

        // Update state and local storage
        setArticle(newArticle);
        setAllArticles(updatedAllArticles);
        localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  return (
    <section className="wrapper grid grid-cols-1 lg:grid-cols-2 gap-8 my-auto min-h-[52vh]">
      {/* Input Form */}
      <div className="flex flex-col gap-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-row justify-between p-4 bg-primary/75 focus:bg-primary/90 border-2 border-background shadow-[-6px_6px_0px_rgba(244,62,11,0.8)] hover:shadow-[-6px_-6px_0px_rgba(244,62,11,0.8)] transition-all duration-300"
        >
          <input
            type="url"
            placeholder="Enter an URL to Article"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="w-full truncate font-bold text-lg px-1 placeholder:text-background/50 focus:placeholder:text-foreground focus:border-foreground focus:outline-none focus:ring-0 bg-transparent"
          />
          <button
            type="submit"
            className="flex gap-2 text-2xl px-1 flex-center underline text-background hover:text-foreground transition-all duration-300 my-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8 my-auto hidden md:block hover:translate-x-2 transition-all duration-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </form>

        {/* Display Saved Articles */}
        <div className="flex flex-col gap-4">
          {allArticles.map((item, index) => (
            <motion.div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 0.5, 0.36, 1] }}
              className="cursor-pointer"
            >
              <p className="line-clamp-1 text-sm md:text-base text-primary/50 hover:text-foreground hover:underline underline-offset-4 transition-all duration-300">
                {item.url}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Display Article Summary */}
      <div className="w-full flex flex-col gap-5" id="summary">
        {isFetching ? (
          <Loading />
        ) : error ? (
          <p>
            Oops, We Ran Into An Error! <br />
            <span>Reason: {error?.data?.error}</span>
          </p>
        ) : (
          article.summary && (
            <motion.div
              className={`flex flex-col ${
                readMore
                  ? "absolute top-0 left-0 size-full z-20 bg-background/80 text-background transition-all duration-300"
                  : ""
              }`}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 1, ease: [0.22, 0.5, 0.36, 1] }}
            >
              <div
                className={`${
                  readMore
                    ? "mx-auto px-[6vw] py-[4vh] bg-primary/85 border-2 border-background shadow-[-12px_12px_0px_rgba(244,62,11,1)]"
                    : ""
                }`}
              >
                <div className={`flex flex-col gap-6`}>
                  <div className="flex justify-between">
                    <h2 className="text-4xl md:text-5xl text-foreground underline">
                      Summary:
                    </h2>
                    {readMore && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => setReadMore(false)}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-10 h-10 cursor-pointer hover:rotate-180 hover:text-foreground transition-all duration-300"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </div>
                  <p
                    className={`text-base md:text-lg ${
                      readMore
                        ? "text-background"
                        : "text-primary line-clamp-6"
                    }`}
                  >
                    {article.summary}
                  </p>
                  {!readMore && (
                    <button
                      className="bg-primary/80 hover:bg-primary/90 px-4 py-2 text-foreground font-bold border-2 shadow-[-6px_6px_0px_rgba(244,62,11,0.8)] hover:shadow-[-6px_-6px_0px_rgba(244,62,11,0.8)] transition-all duration-300"
                      onClick={() => setReadMore(true)}
                    >
                      Read More
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        )}
      </div>
    </section>
  );
};

export default Search;
