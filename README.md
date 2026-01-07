# closeby-server
Closeby

<!-- Create book -->

curl --location 'localhost:3000/v1/book' \
--header 'Content-Type: application/json' \
--data '{
    "title": "Froggy'\''s Patient Adventure",
    "summary": "Froggy learns the value of patience and perseverance while hunting for fireflies in a lush forest.",
    "content": "In a lush, green forest filled with tall trees and colorful flowers, there lived a little frog named Froggy. One warm summer evening, Froggy told his family that he wanted to catch some fireflies for dinner. But the problem was, fireflies were very elusive creatures, especially at night when they came out most active.\n\nFroggy tried various methods to catch them - using a net, chasing after them on the ground with his feet, and even trying to catch them in mid-air with his long tongue. However, none of these strategies worked. The more he tried, the more frustrated he became.\n\nJust when Froggy was about to give up hope, he heard someone rustling through the leaves behind him. He turned around and saw an older salamander named Sam. Salamander Sam smiled at Froggy and said, '\''I'\''ve been watching you trying to catch those fireflies all evening. It'\''s very important to be patient when hunting for them at night.'\''\n\nSam explained that the trick was to wait quietly and still until a firefly landed nearby, then quickly snatch it up before it flew away again. This would require patience, but in the end, it would be worth the effort.\n\nFroggy decided to give it another try with Sam'\''s help. For many long nights, they sat under the trees waiting for the fireflies. Froggy had to hold back from jumping and grabbing at them every time one buzzed nearby, but he knew that was the right thing to do.\n\nFinally, after all those hours of practice, Froggy caught enough fireflies to bring home to his family. His mother was so happy that her son had managed to find a delicious meal for everyone to enjoy together. \n\nFroggy learned an important lesson about patience and persistence from Salamander Sam. He knew now that even when things seemed impossible, as long as he kept trying with all his might, eventually, success would come his way.",
    "genre": "animals",
    "audio_url": [
        "https://sample.info/?harmony=poison&toad=point#air"
    ],
    "duration": "3h",
    "cover_image_url": "https://www.sample.org/art",
    "age_group": [
        0,
        2
    ],
    "highlights": [
        "frog",
        "firefly",
        "patience",
        "adventure"
    ]
}'

<!-- Get all books -->
curl --location 'localhost:3000/v1/book'

<!-- Get single book -->
curl --location 'localhost:3000/v1/book/:bookId'

