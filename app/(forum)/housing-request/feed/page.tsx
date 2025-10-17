// Example using mock data - Replace with real API call when backend is ready
import { PostCategory } from "@/types";
import { getMockPostsByCategory, createMockPaginatedResponse } from "@/mocks";

export default function HousingRequestFeed() {
  // Get mock housing request posts
  const allPosts = getMockPostsByCategory(PostCategory.HOUSING_REQUEST);

  // Simulate paginated API response
  const response = createMockPaginatedResponse(allPosts, 1, 10);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Housing Requests</h1>
        <p className="text-gray-600 mt-2">
          {response.meta.totalCount} requests found
        </p>
      </div>

      <div className="space-y-6">
        {response.data.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            {/* Post Header */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{post.author.username}</p>
                <p className="text-sm text-gray-500">
                  Level {post.author.level}
                </p>
              </div>
            </div>

            {/* Post Content */}
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-700 mb-4">{post.content}</p>

            {/* Post Images */}
            {post.images && post.images.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-2">
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${post.title} - ${index + 1}`}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                ))}
              </div>
            )}

            {/* Post Stats */}
            <div className="flex gap-6 text-sm text-gray-500">
              <span>👁️ {post.stats.views} views</span>
              <span>❤️ {post.stats.likes} likes</span>
              <span>⭐ {post.stats.stars} stars</span>
              <span>💬 {post.stats.replies} replies</span>
            </div>

            {/* Post Date */}
            <div className="mt-4 text-xs text-gray-400">
              Posted on {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Info */}
      <div className="mt-8 text-center text-gray-600">
        <p>
          Page {response.meta.page} of {response.meta.totalPages}
        </p>
        <p className="text-sm mt-1">
          {response.meta.hasNextPage && "More posts available"}
        </p>
      </div>

      {/* Development Note */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>📝 Note:</strong> This page is currently using mock data.
          Replace with real API calls when backend is ready.
        </p>
      </div>
    </div>
  );
}
