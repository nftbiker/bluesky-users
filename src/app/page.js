"use client";

import { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';

export default function SearchApp() {
  const [query, setQuery] = useState("automated @andreitr.bsky.social");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState('');
  const [hasMore, setHasMore] = useState(false);

  const predefinedSearches = [
    { text: "automated @andreitr.bsky.social", label: "@anderitr" },
    { text: "automated @botfrens.bsky.social", label: "@botfrens" },
    { text: "automated #artbot", label: "Automated artbot" },
  ];

  const doPredefinedSearch = async (q) => {
    setResults([]);
    setCursor('');
    setQuery(q);
    searchBluesky(q);
  }

  const searchBluesky = async (searchQuery, searchCursor = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        limit: '100',
        cursor: searchCursor,
      }).toString();

      const response = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();

      if (searchCursor === '') {
        setResults(data.actors);
      } else {
        setResults(prev => [...prev, ...data.actors]);
      }

      setCursor(data.cursor);
      setHasMore(data.actors.length === 100);
    } catch (error) {
      console.error('Error during search:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setResults([]);
      setCursor('');
      searchBluesky(query);
    }
  };

  const loadMore = () => {
    if (cursor && !loading) {
      searchBluesky(query, cursor);
    }
  };

  const getProfileUrl = (handle) => {
    return `https://bsky.app/profile/${handle}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Bluesky Artbot Search
        </h1>

        <div className="mb-4 flex flex-wrap gap-2">
          {predefinedSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => doPredefinedSearch(search.text)}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              {search.label}
            </button>
          ))}
        </div>


        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a user..."
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Search className="w-5 h-5 text-gray-500 hover:text-blue-500 transition-colors" />
            </button>
          </div>
        </form>

        {loading && (
          <div className="flex justify-center my-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div className="space-y-4">
          {results.map((user, index) => (
            <div
              key={`${user.did}-${index}`}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {user.displayName || user.handle}
                    </h3>
                    <a
                      href={getProfileUrl(user.handle)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      View profile
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-gray-500">@{user.handle}</p>
                  {user.description && (
                    <p className="text-gray-600 mt-2">{user.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              Load more
            </button>
          </div>
        )}

        {results.length > 0 && (
          <p className="text-center text-gray-500 mt-4">
            {results.length} results displayed
          </p>
        )}
      </div>
    </div>
  );
}