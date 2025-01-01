// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTBucketLinker {
    struct Bucket {
        string bucketType;  // e.g., "visit", "activity"
        string name;        // name of the activity or place
        string place;       // location
        bool isCompleted;   // track if bucket list item is completed
    }

    struct UserNFTLink {
        uint256 tokenId;    // The NFT token ID
        address nftAddress; // The NFT contract address
        Bucket[] selectedBuckets;
        uint256 timestamp;  // When the link was created
    }

    // Mapping from user address to their NFT links
    mapping(address => UserNFTLink[]) public userLinks;
    
    // Mapping to store user follow relationships
    mapping(address => address[]) public userFollows;
    
    // Mapping to track if a token is already linked
    mapping(address => mapping(uint256 => bool)) public isTokenLinked;

    event NFTLinked(
        address indexed user,
        address indexed nftAddress,
        uint256 indexed tokenId,
        Bucket[] selectedBuckets
    );
    event BucketCompleted(
        address indexed user,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 bucketIndex
    );
    event UserFollowed(address indexed follower, address indexed followee);
    event UserUnfollowed(address indexed follower, address indexed followee);

    /// @notice Link user's NFT to buckets, verifying ownership
    /// @param nftAddress The address of the NFT contract
    /// @param tokenId The ID of the NFT token
    /// @param bucketTypes Array of bucket types
    /// @param names Array of bucket names
    /// @param places Array of places
    function linkNFTToBuckets(
        address nftAddress,
        uint256 tokenId,
        string[] memory bucketTypes,
        string[] memory names,
        string[] memory places
    ) public {
        require(
            bucketTypes.length == names.length && names.length == places.length,
            "Mismatched input lengths"
        );
        
        // Verify NFT ownership
        IERC721 nftContract = IERC721(nftAddress);
        require(
            nftContract.ownerOf(tokenId) == msg.sender,
            "Caller must own the NFT"
        );
        
        require(!isTokenLinked[nftAddress][tokenId], "Token already linked");

        // Create new link
        userLinks[msg.sender].push();
        UserNFTLink storage newLink = userLinks[msg.sender][userLinks[msg.sender].length - 1];
        newLink.tokenId = tokenId;
        newLink.nftAddress = nftAddress;
        newLink.timestamp = block.timestamp;

        // Add buckets
        for (uint i = 0; i < bucketTypes.length; i++) {
            newLink.selectedBuckets.push(
                Bucket({
                    bucketType: bucketTypes[i],
                    name: names[i],
                    place: places[i],
                    isCompleted: false
                })
            );
        }

        isTokenLinked[nftAddress][tokenId] = true;
        emit NFTLinked(msg.sender, nftAddress, tokenId, newLink.selectedBuckets);
    }

    /// @notice Mark a bucket list item as completed
    /// @param linkIndex Index of the NFT link
    /// @param bucketIndex Index of the bucket to mark completed
    function completeBucket(uint256 linkIndex, uint256 bucketIndex) public {
        require(linkIndex < userLinks[msg.sender].length, "Invalid link index");
        UserNFTLink storage link = userLinks[msg.sender][linkIndex];
        require(bucketIndex < link.selectedBuckets.length, "Invalid bucket index");
        
        // Verify current ownership
        IERC721 nftContract = IERC721(link.nftAddress);
        require(
            nftContract.ownerOf(link.tokenId) == msg.sender,
            "Must still own the NFT"
        );

        require(!link.selectedBuckets[bucketIndex].isCompleted, "Already completed");
        
        link.selectedBuckets[bucketIndex].isCompleted = true;
        emit BucketCompleted(msg.sender, link.nftAddress, link.tokenId, bucketIndex);
    }

    /// @notice Follow or unfollow another user
    /// @param followee The address to follow/unfollow
    function toggleFollow(address followee) public {
        require(followee != address(0), "Invalid followee address");
        require(msg.sender != followee, "Cannot follow yourself");

        address[] storage followees = userFollows[msg.sender];
        
        for (uint i = 0; i < followees.length; i++) {
            if (followees[i] == followee) {
                // Unfollow
                followees[i] = followees[followees.length - 1];
                followees.pop();
                emit UserUnfollowed(msg.sender, followee);
                return;
            }
        }

        // Follow
        followees.push(followee);
        emit UserFollowed(msg.sender, followee);
    }

    /// @notice Check if a user follows another
    function isFollowing(address follower, address followee) public view returns (bool) {
        address[] storage followees = userFollows[follower];
        for (uint i = 0; i < followees.length; i++) {
            if (followees[i] == followee) return true;
        }
        return false;
    }

    /// @notice Get all NFTs and their buckets for a user
    function getUserBucketList(address user) public view returns (
        UserNFTLink[] memory
    ) {
        return userLinks[user];
    }

    /// @notice Get followed users
    function getFollowedUsers(address user) public view returns (address[] memory) {
        return userFollows[user];
    }
}