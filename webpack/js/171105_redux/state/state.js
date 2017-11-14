const blogPosts = [{
        id: "post1",
        author: { username: "user1", name: "User 1" },
        body: "......",
        comments: [{
            id: "comment1",
            author: { username: "user2", name: "User 2" },
            comment: ".....",
        }, {
            id: "comment2",
            author: { username: "user3", name: "User 3" },
            comment: ".....",
        }]
    }, {
        id: "post2",
        author: { username: "user2", name: "User 2" },
        body: "......",
        comments: [{
            id: "comment3",
            author: { username: "user3", name: "User 3" },
            comment: ".....",
        }, {
            id: "comment4",
            author: { username: "user1", name: "User 1" },
            comment: ".....",
        }, {
            id: "comment5",
            author: { username: "user3", name: "User 3" },
            comment: ".....",
        }]
    }
    // and repeat many times
]


{
    posts: {
        byId: {
            "post1": {
                id: "post1",
                author: "user1",
                body: "......",
                comments: ["comment1", "comment2"]
            },
            "post2": {
                id: "post2",
                author: "user2",
                body: "......",
                comments: ["comment3", "comment4", "comment5"]
            }
        },
        allIds: ["post1", "post2"]
    },
    comments: {
        byId: {
            "comment1": {
                id: "comment1",
                author: "user2",
                comment: ".....",
            },
            "comment2": {
                id: "comment2",
                author: "user3",
                comment: ".....",
            },
            "comment3": {
                id: "comment3",
                author: "user3",
                comment: ".....",
            },
            "comment4": {
                id: "comment4",
                author: "user1",
                comment: ".....",
            },
            "comment5": {
                id: "comment5",
                author: "user3",
                comment: ".....",
            },
        },
        allIds: ["comment1", "comment2", "comment3", "commment4", "comment5"]
    },
    users: {
        byId: {
            "user1": {
                username: "user1",
                name: "User 1",
            },
            "user2": {
                username: "user2",
                name: "User 2",
            },
            "user3": {
                username: "user3",
                name: "User 3",
            }
        },
        allIds: ["user1", "user2", "user3"]
    }
}


{
    entities: {
        authors : { byId : {}, allIds : [] },
        books : { byId : {}, allIds : [] },
        authorBook : {
            byId : {
                1 : {
                    id : 1,
                    authorId : 5,
                    bookId : 22
                },
                2 : {
                    id : 2,
                    authorId : 5,
                    bookId : 15,
                }
                3 : {
                    id : 3,
                    authorId : 42,
                    bookId : 12
                }
            },
            allIds : [1, 2, 3]

        }
    }
}