
// File: @openzeppelin/contracts/utils/introspection/IERC165.sol


// OpenZeppelin Contracts (last updated v5.1.0) (utils/introspection/IERC165.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC-165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[ERC].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[ERC section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

// File: @openzeppelin/contracts/token/ERC721/IERC721.sol


// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC721/IERC721.sol)

pragma solidity ^0.8.20;


/**
 * @dev Required interface of an ERC-721 compliant contract.
 */
interface IERC721 is IERC165 {
    /**
     * @dev Emitted when `tokenId` token is transferred from `from` to `to`.
     */
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
     */
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
     */
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon
     *   a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC-721 protocol to prevent tokens from being forever locked.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must have been allowed to move this token by either {approve} or
     *   {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon
     *   a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) external;

    /**
     * @dev Transfers `tokenId` token from `from` to `to`.
     *
     * WARNING: Note that the caller is responsible to confirm that the recipient is capable of receiving ERC-721
     * or else they may be permanently lost. Usage of {safeTransferFrom} prevents loss, though the caller must
     * understand this adds an external call which potentially creates a reentrancy vulnerability.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 tokenId) external;

    /**
     * @dev Gives permission to `to` to transfer `tokenId` token to another account.
     * The approval is cleared when the token is transferred.
     *
     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
     *
     * Requirements:
     *
     * - The caller must own the token or be an approved operator.
     * - `tokenId` must exist.
     *
     * Emits an {Approval} event.
     */
    function approve(address to, uint256 tokenId) external;

    /**
     * @dev Approve or remove `operator` as an operator for the caller.
     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
     *
     * Requirements:
     *
     * - The `operator` cannot be the address zero.
     *
     * Emits an {ApprovalForAll} event.
     */
    function setApprovalForAll(address operator, bool approved) external;

    /**
     * @dev Returns the account approved for `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function getApproved(uint256 tokenId) external view returns (address operator);

    /**
     * @dev Returns if the `operator` is allowed to manage all of the assets of `owner`.
     *
     * See {setApprovalForAll}
     */
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}

// File: @openzeppelin/contracts/utils/Context.sol


// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

pragma solidity ^0.8.20;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}

// File: @openzeppelin/contracts/access/Ownable.sol


// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

pragma solidity ^0.8.20;


/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// File: contracts/bucket.sol


pragma solidity ^0.8.0;



interface IBucketToken {
    function mintReward(address to, uint256 amount) external;
}

contract NFTBucketLinker is Ownable {
    struct Bucket {
        string bucketType;
        string name;
        string place;
        bool isCompleted;
    }

    struct UserNFTLink {
        uint256 tokenId;
        address nftAddress;
        Bucket[] selectedBuckets;
        uint256 timestamp;
    }

    // Token rewards configuration
    IBucketToken public rewardToken;
    uint256 public createRewardAmount = 10 * 10**18;    // 10 tokens for creating
    uint256 public completeRewardAmount = 5 * 10**18;   // 5 tokens for completing

    // Existing mappings
    mapping(address => UserNFTLink[]) public userLinks;
    mapping(address => address[]) public userFollows;
    mapping(address => mapping(uint256 => bool)) public isTokenLinked;

    // Existing events
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
    
    // New events
    event RewardPaid(address indexed user, uint256 amount, string rewardType);
    event RewardConfigUpdated(uint256 createAmount, uint256 completeAmount);

    constructor(address initialOwner) Ownable(initialOwner) {}

    // Admin functions
    function setRewardToken(address _rewardToken) external onlyOwner {
        require(_rewardToken != address(0), "Invalid token address");
        rewardToken = IBucketToken(_rewardToken);
    }

    function setRewardAmounts(uint256 _createAmount, uint256 _completeAmount) external onlyOwner {
        createRewardAmount = _createAmount;
        completeRewardAmount = _completeAmount;
        emit RewardConfigUpdated(_createAmount, _completeAmount);
    }

    // Modified linkNFTToBuckets function with rewards
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
        
        IERC721 nftContract = IERC721(nftAddress);
        require(
            nftContract.ownerOf(tokenId) == msg.sender,
            "Caller must own the NFT"
        );
        
        require(!isTokenLinked[nftAddress][tokenId], "Token already linked");

        userLinks[msg.sender].push();
        UserNFTLink storage newLink = userLinks[msg.sender][userLinks[msg.sender].length - 1];
        newLink.tokenId = tokenId;
        newLink.nftAddress = nftAddress;
        newLink.timestamp = block.timestamp;

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
        
        // Mint creation reward
        if (address(rewardToken) != address(0)) {
            rewardToken.mintReward(msg.sender, createRewardAmount);
            emit RewardPaid(msg.sender, createRewardAmount, "creation");
        }

        emit NFTLinked(msg.sender, nftAddress, tokenId, newLink.selectedBuckets);
    }

    // Modified completeBucket function with rewards
    function completeBucket(uint256 linkIndex, uint256 bucketIndex) public {
        require(linkIndex < userLinks[msg.sender].length, "Invalid link index");
        UserNFTLink storage link = userLinks[msg.sender][linkIndex];
        require(bucketIndex < link.selectedBuckets.length, "Invalid bucket index");
        
        IERC721 nftContract = IERC721(link.nftAddress);
        require(
            nftContract.ownerOf(link.tokenId) == msg.sender,
            "Must still own the NFT"
        );

        require(!link.selectedBuckets[bucketIndex].isCompleted, "Already completed");
        
        link.selectedBuckets[bucketIndex].isCompleted = true;
        
        // Mint completion reward
        if (address(rewardToken) != address(0)) {
            rewardToken.mintReward(msg.sender, completeRewardAmount);
            emit RewardPaid(msg.sender, completeRewardAmount, "completion");
        }

        emit BucketCompleted(msg.sender, link.nftAddress, link.tokenId, bucketIndex);
    }

    // Existing functions remain the same
    function toggleFollow(address followee) public {
        require(followee != address(0), "Invalid followee address");
        require(msg.sender != followee, "Cannot follow yourself");

        address[] storage followees = userFollows[msg.sender];
        
        for (uint i = 0; i < followees.length; i++) {
            if (followees[i] == followee) {
                followees[i] = followees[followees.length - 1];
                followees.pop();
                emit UserUnfollowed(msg.sender, followee);
                return;
            }
        }

        followees.push(followee);
        emit UserFollowed(msg.sender, followee);
    }

    function isFollowing(address follower, address followee) public view returns (bool) {
        address[] storage followees = userFollows[follower];
        for (uint i = 0; i < followees.length; i++) {
            if (followees[i] == followee) return true;
        }
        return false;
    }

    function getUserBucketList(address user) public view returns (
        UserNFTLink[] memory
    ) {
        return userLinks[user];
    }

    function getFollowedUsers(address user) public view returns (address[] memory) {
        return userFollows[user];
    }
}