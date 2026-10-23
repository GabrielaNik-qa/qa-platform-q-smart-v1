// Usage: node seed.js
// Puts back EXACTLY the data stored below: all users, teams, reviews, scorecards, coaching sessions, tasks, knowledge base ...
// If a data.json already exists it is first saved as data.backup.json.
// The server also uses this data by itself when it starts and there is no data.json yet (for example in a new folder).
const fs = require('fs'), path = require('path');
const DATA = {
  "users": [
    {
      "username": "v.petrova",
      "name": "Viktoria Petrova",
      "email": "vpetrova@converst.com",
      "role": "agent",
      "hash": "$2b$10$2rHCoDUPiL9Y6fbYGYgkDOq77uyc7uDiObVBy45HRXvJGJeIZQ06y",
      "team": "t-b2b",
      "active": true,
      "languages": [
        "English"
      ],
      "skills": [
        "Balenciaga"
      ],
      "teamHistory": [
        {
          "from": "",
          "to": "t-support",
          "at": "2026-10-21T09:12:51.942Z",
          "by": "Gabriela Georgieva"
        }
      ],
      "title": "Sales Agent",
      "desc": "test",
      "phone": "",
      "start": "2026-01-01"
    },
    {
      "username": "g.georrgieva",
      "name": "Gabriela Georgieva",
      "email": "g.georrgieva@gmail.com",
      "role": "admin",
      "hash": "$2b$10$jIdqQLtEnM/cJTjVhzGTtuTcMVcLPIbL656H4.9zdWbS7pnsVvbv2",
      "active": true,
      "languages": [
        "french",
        "english"
      ],
      "skills": [
        "Nike",
        "Balenciaga",
        "Asics"
      ],
      "mustChange": false,
      "desc": "",
      "teamHistory": [
        {
          "from": "",
          "to": "t-40aeb9",
          "at": "2026-10-21T09:18:32.389Z",
          "by": "Gabriela Georgieva"
        }
      ],
      "team": "t-admin",
      "title": "Account manager",
      "phone": "",
      "start": ""
    },
    {
      "username": "g.nikolova",
      "name": "Gabriela Nikolova",
      "email": "gnikolova@converst.com",
      "role": "qa",
      "hash": "$2b$10$RhKCFPfeC.EnSAGK7zS1OOAuHnX5Fi8Bv5DOsochBmxE58yGxQM5y",
      "active": true,
      "languages": [
        "English"
      ],
      "skills": [
        "Nike",
        "Balenciaga",
        "Asics"
      ],
      "teamHistory": [
        {
          "from": "",
          "to": "t-40aeb9",
          "at": "2026-10-21T09:17:18.007Z",
          "by": "Gabriela Georgieva"
        }
      ],
      "team": "t-admin",
      "title": "QA Specialist",
      "desc": "",
      "phone": "",
      "start": ""
    },
    {
      "username": "g.pencheva",
      "name": "Gabriela Pencheva",
      "email": "gab4ito_vt@abv.bg",
      "role": "lead",
      "hash": "$2b$10$Iv2E4S0gdjpblZe4q.slk.ay2uG81tgb0tuSyanKs4rsxlqyPPv8W",
      "active": true,
      "languages": [
        "English",
        "French"
      ],
      "skills": [
        "Nike",
        "Balenciaga",
        "Asics"
      ],
      "teamHistory": [
        {
          "from": "",
          "to": "t-b2c",
          "at": "2026-10-21T09:24:28.658Z",
          "by": "Gabriela Georgieva"
        }
      ],
      "team": "t-admin",
      "title": "Team Lead",
      "desc": "",
      "phone": "",
      "start": ""
    },
    {
      "username": "m.duval",
      "name": "Marc Duval",
      "email": "m.duval@test.com",
      "role": "lead",
      "team": "t-admin",
      "title": "Team Lead",
      "desc": "",
      "languages": [
        "English"
      ],
      "skills": [
        "Nike",
        "Balenciaga",
        "Asics"
      ],
      "phone": "",
      "start": "",
      "active": true,
      "hash": "$2b$10$c.WqSQmNt295Fflaf4WDRu9vUJ1aZCpscLAhTvKlIY9/tLex/iAXe",
      "mustChange": false
    },
    {
      "username": "n.ivanova",
      "name": "Nora Ivanova",
      "email": "n.ivanova@test.com",
      "role": "lead",
      "team": "t-admin",
      "title": "Team Lead",
      "desc": "",
      "languages": [
        "English",
        "French"
      ],
      "skills": [
        "Nike",
        "Balenciaga",
        "Asics"
      ],
      "phone": "",
      "start": "",
      "active": true,
      "hash": "$2b$10$c.WqSQmNt295Fflaf4WDRu9vUJ1aZCpscLAhTvKlIY9/tLex/iAXe",
      "mustChange": false
    },
    {
      "username": "i.marinova",
      "name": "Iva Marinova",
      "email": "i.marinova@test.com",
      "role": "trainer",
      "team": "t-admin",
      "title": "Trainer",
      "desc": "",
      "languages": [
        "English",
        "French"
      ],
      "skills": [
        "Nike",
        "Balenciaga",
        "Asics"
      ],
      "phone": "",
      "start": "",
      "active": true,
      "hash": "$2b$10$c.WqSQmNt295Fflaf4WDRu9vUJ1aZCpscLAhTvKlIY9/tLex/iAXe",
      "mustChange": false,
      "teamHistory": [
        {
          "from": "",
          "to": "t-40aeb9",
          "at": "2026-10-21T09:16:54.572Z",
          "by": "Gabriela Georgieva"
        }
      ]
    },
    {
      "username": "b.kolev",
      "name": "Boris Kolev",
      "email": "b.kolev@test.com",
      "role": "trainer",
      "team": "t-admin",
      "title": "Trainer",
      "desc": "",
      "languages": [
        "English"
      ],
      "skills": [
        "Nike",
        "Balenciaga",
        "Asics"
      ],
      "phone": "",
      "start": "",
      "active": true,
      "hash": "$2b$10$c.WqSQmNt295Fflaf4WDRu9vUJ1aZCpscLAhTvKlIY9/tLex/iAXe",
      "mustChange": false,
      "teamHistory": [
        {
          "from": "",
          "to": "t-40aeb9",
          "at": "2026-10-21T09:16:48.405Z",
          "by": "Gabriela Georgieva"
        }
      ]
    },
    {
      "username": "d.petrov",
      "name": "Deyan Petrov",
      "email": "d.petrov@test.com",
      "role": "agent",
      "team": "t-b2c",
      "title": "Sales Agent",
      "desc": "",
      "languages": [
        "English",
        "French"
      ],
      "skills": [
        "Asics"
      ],
      "phone": "",
      "start": "",
      "active": true,
      "hash": "$2b$10$c.WqSQmNt295Fflaf4WDRu9vUJ1aZCpscLAhTvKlIY9/tLex/iAXe",
      "mustChange": false
    },
    {
      "username": "m.todorova",
      "name": "Maria Todorova",
      "email": "m.todorova@test.com",
      "role": "agent",
      "team": "t-b2b",
      "title": "Sales Agent",
      "desc": "",
      "languages": [
        "English"
      ],
      "skills": [
        "Nike"
      ],
      "phone": "",
      "start": "",
      "active": true,
      "hash": "$2b$10$c.WqSQmNt295Fflaf4WDRu9vUJ1aZCpscLAhTvKlIY9/tLex/iAXe",
      "mustChange": false
    },
    {
      "username": "c.kemp",
      "name": "Charles Kemp",
      "email": "c.kemp@test.com",
      "role": "agent",
      "team": "t-b2b",
      "title": "Sales Agent",
      "desc": "",
      "languages": [
        "English",
        "French"
      ],
      "skills": [
        "Balenciaga"
      ],
      "phone": "",
      "start": "",
      "active": true,
      "hash": "$2b$10$c.WqSQmNt295Fflaf4WDRu9vUJ1aZCpscLAhTvKlIY9/tLex/iAXe",
      "mustChange": false
    },
    {
      "username": "k.dimova",
      "name": "Kamelia Dimova",
      "email": "k.dimova@test.com",
      "role": "agent",
      "team": "t-b2c",
      "title": "Sales Agent",
      "desc": "",
      "languages": [
        "English",
        "French"
      ],
      "skills": [
        "Asics"
      ],
      "phone": "",
      "start": "",
      "active": true,
      "hash": "$2b$10$c.WqSQmNt295Fflaf4WDRu9vUJ1aZCpscLAhTvKlIY9/tLex/iAXe",
      "mustChange": false
    },
    {
      "username": "s.mensah",
      "name": "Sofia Mensah",
      "email": "s.mensah@test.com",
      "role": "agent",
      "team": "t-b2b",
      "title": "Sales Agent",
      "desc": "",
      "languages": [
        "English"
      ],
      "skills": [
        "Nike"
      ],
      "phone": "",
      "start": "",
      "active": true,
      "hash": "$2b$10$c.WqSQmNt295Fflaf4WDRu9vUJ1aZCpscLAhTvKlIY9/tLex/iAXe",
      "mustChange": false
    },
    {
      "username": "i.schmidt",
      "name": "Ivan Schmidt",
      "email": "i.schmidt@test.com",
      "role": "agent",
      "team": "t-b2b",
      "title": "Sales Agent",
      "desc": "",
      "languages": [
        "English",
        "French"
      ],
      "skills": [
        "Balenciaga"
      ],
      "phone": "",
      "start": "",
      "active": true,
      "hash": "$2b$10$c.WqSQmNt295Fflaf4WDRu9vUJ1aZCpscLAhTvKlIY9/tLex/iAXe",
      "mustChange": false
    },
    {
      "username": "s.blanc",
      "name": "Sandra Blanc",
      "email": "s.blanc@test.com",
      "role": "agent",
      "team": "t-b2c",
      "title": "Sales Agent",
      "desc": "",
      "languages": [
        "English",
        "French"
      ],
      "skills": [
        "Asics"
      ],
      "phone": "",
      "start": "",
      "active": true,
      "hash": "$2b$10$c.WqSQmNt295Fflaf4WDRu9vUJ1aZCpscLAhTvKlIY9/tLex/iAXe",
      "mustChange": false
    },
    {
      "username": "r.shishkov",
      "name": "Rene Shishkov",
      "email": "r.shishkov@test.com",
      "role": "agent",
      "team": "t-b2b",
      "title": "Sales Agent",
      "desc": "",
      "languages": [
        "English"
      ],
      "skills": [
        "Nike"
      ],
      "phone": "",
      "start": "",
      "active": true,
      "hash": "$2b$10$c.WqSQmNt295Fflaf4WDRu9vUJ1aZCpscLAhTvKlIY9/tLex/iAXe",
      "mustChange": false
    },
    {
      "username": "gabriela.registration",
      "name": "Gabriela Registration",
      "email": "nikolovagabriela_1@yahoo.com",
      "role": "agent",
      "team": "t-b2c",
      "title": "",
      "desc": "",
      "languages": [],
      "skills": [],
      "phone": "",
      "start": "",
      "active": true,
      "hash": "$2b$10$KHgzTrUcg/N6Tl9Z4Q.XhOv2oAlZzYezKxEL867xmKNwqAouKoodC",
      "mustChange": false
    }
  ],
  "evaluations": [
    {
      "rid": "rb8870e57a335",
      "id": "1234656",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-23T09:00:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Gabriela Georgieva",
      "by": "g.georrgieva",
      "seen": null,
      "rec": "rb8870e57a335-1792564989362.mp3"
    },
    {
      "rid": "r7adc54643e07",
      "id": "123456",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-22T09:00:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "green",
      "cp": "",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Gabriela Georgieva",
      "by": "g.georrgieva",
      "seen": null,
      "rec": "r7adc54643e07-1792564967265.mp3"
    },
    {
      "rid": "rdemo007",
      "id": "4975090",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-20T13:31:00.000Z",
      "sc": 88.3,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 10,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 4,
          "m": 4,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-20T22:31:00.000Z"
    },
    {
      "rid": "rdemo006",
      "id": "4556105",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-20T12:18:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 11,
          "m": 11,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "na",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "green",
      "cp": "beta fr regulars 30-60",
      "cm": "Great rapport with the customer",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo005",
      "id": "4898198",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-20T11:05:00.000Z",
      "sc": 89,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 6,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-20T18:05:00.000Z"
    },
    {
      "rid": "rdemo004",
      "id": "4497444",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-20T10:52:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 13,
          "m": 13,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 13,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Should have left a voicemail message",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-20T16:52:00.000Z"
    },
    {
      "rid": "rdemo003",
      "id": "4919028",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-20T09:39:00.000Z",
      "sc": 89,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 11,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo002",
      "id": "4076039",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-20T08:26:00.000Z",
      "sc": 81.7,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 6,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 13,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 7,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-20T12:26:00.000Z"
    },
    {
      "rid": "rdemo001",
      "id": "4516243",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-20T07:13:00.000Z",
      "sc": 93,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-20T10:13:00.000Z"
    },
    {
      "rid": "rdemo000",
      "id": "4152573",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-20T06:00:00.000Z",
      "sc": 87,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 7,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null,
      "dp": {
        "status": "resolved",
        "at": "2026-10-20T06:00:00.000Z",
        "msgs": [
          {
            "u": "d.petrov",
            "n": "Deyan Petrov",
            "r": "agent",
            "t": "I do not agree with this score. Could we go through the call again?",
            "at": "2026-10-20T06:00:00.000Z"
          },
          {
            "u": "g.georrgieva",
            "n": "Gabriela Georgieva",
            "r": "admin",
            "t": "okay",
            "at": "2026-10-21T06:34:04.822Z"
          },
          {
            "u": "g.georrgieva",
            "n": "Gabriela Georgieva",
            "r": "admin",
            "sys": 1,
            "t": "Dispute resolved - score changed: changed",
            "at": "2026-10-21T06:37:10.753Z"
          }
        ],
        "res": {
          "outcome": "changed",
          "note": "changed",
          "by": "Gabriela Georgieva",
          "at": "2026-10-21T06:37:10.753Z"
        }
      },
      "rm": "2026-10-21T06:32:33.992Z"
    },
    {
      "rid": "rdemo008",
      "id": "4307664",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-19T14:44:00.000Z",
      "sc": 81,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 9,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-20T00:44:00.000Z"
    },
    {
      "rid": "rdemo015",
      "id": "4683082",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-19T12:15:00.000Z",
      "sc": 93,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo014",
      "id": "4099532",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-19T11:02:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Should have left a voicemail message",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-20T03:02:00.000Z"
    },
    {
      "rid": "rdemo013",
      "id": "4383798",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-19T10:49:00.000Z",
      "sc": 87,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-20T01:49:00.000Z"
    },
    {
      "rid": "rdemo012",
      "id": "4498474",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-19T09:36:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 0,
          "m": 0,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "na",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "green",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo011",
      "id": "4079154",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-19T08:23:00.000Z",
      "sc": 86,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 6,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-19T21:23:00.000Z"
    },
    {
      "rid": "rdemo010",
      "id": "4198252",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-19T07:10:00.000Z",
      "sc": 87,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 9,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-19T19:10:00.000Z"
    },
    {
      "rid": "rdemo009",
      "id": "4223038",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-19T06:57:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "green",
      "cp": "omega fr new 0-30",
      "cm": "Missed an upsell opportunity",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo017",
      "id": "4307051",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-18T14:41:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "disputed",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-19T09:41:00.000Z",
      "dp": {
        "status": "open",
        "at": "2026-10-18T14:41:00.000Z",
        "msgs": [
          {
            "u": "m.todorova",
            "n": "Maria Todorova",
            "r": "agent",
            "t": "I do not agree with this score. Could we go through the call again?",
            "at": "2026-10-18T14:41:00.000Z"
          }
        ]
      }
    },
    {
      "rid": "rdemo016",
      "id": "4780854",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-18T13:28:00.000Z",
      "sc": 94,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "Great rapport with the customer",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-19T07:28:00.000Z"
    },
    {
      "rid": "rdemo023",
      "id": "4813044",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-18T11:59:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-18T16:59:00.000Z"
    },
    {
      "rid": "rdemo022",
      "id": "4086458",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-18T10:46:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-18T14:46:00.000Z"
    },
    {
      "rid": "rdemo021",
      "id": "4315308",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-18T09:33:00.000Z",
      "sc": 93,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo020",
      "id": "4923585",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-18T08:20:00.000Z",
      "sc": 93,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-18T10:20:00.000Z"
    },
    {
      "rid": "rdemo019",
      "id": "4841153",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-18T07:07:00.000Z",
      "sc": 94,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Missed an upsell opportunity",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-19T04:07:00.000Z"
    },
    {
      "rid": "rdemo018",
      "id": "4159596",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-18T06:54:00.000Z",
      "sc": 82,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 10,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo026",
      "id": "4876839",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-17T14:38:00.000Z",
      "sc": 86,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": "Could be improved here"
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "Great rapport with the customer",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-17T22:38:00.000Z"
    },
    {
      "rid": "rdemo025",
      "id": "4215745",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-17T13:25:00.000Z",
      "sc": 95,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 10,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-17T20:25:00.000Z"
    },
    {
      "rid": "rdemo024",
      "id": "4373833",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-17T12:12:00.000Z",
      "sc": 94,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Should have left a voicemail message",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo031",
      "id": "4864006",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-17T10:43:00.000Z",
      "sc": 93,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-17T23:43:00.000Z"
    },
    {
      "rid": "rdemo030",
      "id": "4457608",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-17T09:30:00.000Z",
      "sc": 88,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 10,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo029",
      "id": "4338661",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-17T08:17:00.000Z",
      "sc": 95.3,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 13,
          "m": 13,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "na",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 11,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 13,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Missed an upsell opportunity",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-17T19:17:00.000Z"
    },
    {
      "rid": "rdemo028",
      "id": "4671434",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-17T07:04:00.000Z",
      "sc": 95,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 10,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-17T17:04:00.000Z"
    },
    {
      "rid": "rdemo027",
      "id": "4501186",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-17T06:51:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "green",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo035",
      "id": "4585105",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-16T14:35:00.000Z",
      "sc": 93,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-17T07:35:00.000Z"
    },
    {
      "rid": "rdemo034",
      "id": "4868359",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-16T13:22:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "disputed",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Should have left a voicemail message",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-17T05:22:00.000Z",
      "dp": {
        "status": "open",
        "at": "2026-10-16T13:22:00.000Z",
        "msgs": [
          {
            "u": "c.kemp",
            "n": "Charles Kemp",
            "r": "agent",
            "t": "I do not agree with this score. Could we go through the call again?",
            "at": "2026-10-16T13:22:00.000Z"
          }
        ]
      }
    },
    {
      "rid": "rdemo033",
      "id": "4642730",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-16T12:09:00.000Z",
      "sc": 80,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 0,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo032",
      "id": "4403973",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-16T11:56:00.000Z",
      "sc": 94,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-17T01:56:00.000Z"
    },
    {
      "rid": "rdemo039",
      "id": "4440201",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-16T09:27:00.000Z",
      "sc": 84,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 6,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 4,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Missed an upsell opportunity",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo038",
      "id": "4775644",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-16T08:14:00.000Z",
      "sc": 93,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-17T04:14:00.000Z"
    },
    {
      "rid": "rdemo037",
      "id": "4666490",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-16T07:01:00.000Z",
      "sc": 92.6,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 0,
          "m": 0,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "na",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-17T02:01:00.000Z"
    },
    {
      "rid": "rdemo036",
      "id": "4394562",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-16T06:48:00.000Z",
      "sc": 89,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 11,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "Great rapport with the customer",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo044",
      "id": "4629060",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-15T14:32:00.000Z",
      "sc": 88,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 9,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Should have left a voicemail message",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-15T20:32:00.000Z"
    },
    {
      "rid": "rdemo043",
      "id": "4961544",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-15T13:19:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-15T18:19:00.000Z"
    },
    {
      "rid": "rdemo042",
      "id": "4140075",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-15T12:06:00.000Z",
      "sc": 82,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 4,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo041",
      "id": "4233170",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-15T11:53:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-15T14:53:00.000Z"
    },
    {
      "rid": "rdemo040",
      "id": "4593869",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-15T10:40:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-15T12:40:00.000Z"
    },
    {
      "rid": "rdemo047",
      "id": "4652685",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-15T08:11:00.000Z",
      "sc": 87,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 9,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-15T17:11:00.000Z"
    },
    {
      "rid": "rdemo046",
      "id": "4144854",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-15T07:58:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "Great rapport with the customer",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-15T15:58:00.000Z"
    },
    {
      "rid": "rdemo045",
      "id": "4842067",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-15T06:45:00.000Z",
      "sc": 84,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 6,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo053",
      "id": "4029414",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-14T14:29:00.000Z",
      "sc": 81,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 9,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 7,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-15T05:29:00.000Z"
    },
    {
      "rid": "rdemo052",
      "id": "4727541",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-14T13:16:00.000Z",
      "sc": 82,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 11,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 6,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-15T03:16:00.000Z"
    },
    {
      "rid": "rdemo051",
      "id": "4317454",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-14T12:03:00.000Z",
      "sc": 96,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 11,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "disputed",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null,
      "dp": {
        "status": "open",
        "at": "2026-10-14T12:03:00.000Z",
        "msgs": [
          {
            "u": "k.dimova",
            "n": "Kamelia Dimova",
            "r": "agent",
            "t": "I do not agree with this score. Could we go through the call again?",
            "at": "2026-10-14T12:03:00.000Z"
          }
        ]
      }
    },
    {
      "rid": "rdemo050",
      "id": "4108902",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-14T11:50:00.000Z",
      "sc": 96,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 6,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-14T23:50:00.000Z"
    },
    {
      "rid": "rdemo049",
      "id": "4429070",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-14T10:37:00.000Z",
      "sc": 86,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Missed an upsell opportunity",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-14T21:37:00.000Z"
    },
    {
      "rid": "rdemo048",
      "id": "4032284",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-14T09:24:00.000Z",
      "sc": 84.3,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 6,
          "m": 13,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 6,
          "m": 6,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "na",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo055",
      "id": "4716513",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-14T07:55:00.000Z",
      "sc": 80,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 0,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-15T00:55:00.000Z"
    },
    {
      "rid": "rdemo054",
      "id": "4435842",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-14T06:42:00.000Z",
      "sc": 89,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 10,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Should have left a voicemail message",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo062",
      "id": "4419770",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-13T14:26:00.000Z",
      "sc": 89,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 10,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-13T18:26:00.000Z"
    },
    {
      "rid": "rdemo061",
      "id": "4003348",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-13T13:13:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-13T16:13:00.000Z"
    },
    {
      "rid": "rdemo060",
      "id": "4039283",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-13T12:00:00.000Z",
      "sc": 90,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 5,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo059",
      "id": "4254664",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-13T11:47:00.000Z",
      "sc": 87,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 7,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Missed an upsell opportunity",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-14T08:47:00.000Z"
    },
    {
      "rid": "rdemo058",
      "id": "4682066",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-13T10:34:00.000Z",
      "sc": 94,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 4,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-14T06:34:00.000Z"
    },
    {
      "rid": "rdemo057",
      "id": "4099171",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-13T09:21:00.000Z",
      "sc": 93,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo056",
      "id": "4477845",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-13T08:08:00.000Z",
      "sc": 93.6,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 14,
          "m": 14,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "Great rapport with the customer",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-14T02:08:00.000Z"
    },
    {
      "rid": "rdemo063",
      "id": "4537490",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-13T06:39:00.000Z",
      "sc": 95.7,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 11,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 13,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo071",
      "id": "4072791",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-12T14:23:00.000Z",
      "sc": 81.9,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 7,
          "m": 14,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "na",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 6,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-13T03:23:00.000Z"
    },
    {
      "rid": "rdemo070",
      "id": "4548842",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-12T13:10:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 13,
          "m": 13,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-13T01:10:00.000Z"
    },
    {
      "rid": "rdemo069",
      "id": "4649193",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-12T12:57:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "green",
      "cp": "omega fr new 0-30",
      "cm": "Missed an upsell opportunity",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo068",
      "id": "4837691",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-12T11:44:00.000Z",
      "sc": 92.7,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 6,
          "m": 6,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "na",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "disputed",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-12T21:44:00.000Z",
      "dp": {
        "status": "open",
        "at": "2026-10-12T11:44:00.000Z",
        "msgs": [
          {
            "u": "s.mensah",
            "n": "Sofia Mensah",
            "r": "agent",
            "t": "I do not agree with this score. Could we go through the call again?",
            "at": "2026-10-12T11:44:00.000Z"
          }
        ]
      }
    },
    {
      "rid": "rdemo067",
      "id": "4718202",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-12T10:31:00.000Z",
      "sc": 89.2,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 5,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 13,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-12T19:31:00.000Z"
    },
    {
      "rid": "rdemo066",
      "id": "4437267",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-12T09:18:00.000Z",
      "sc": 88,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 10,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "Great rapport with the customer",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo065",
      "id": "4730855",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-12T08:05:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 4,
          "m": 4,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-12T15:05:00.000Z"
    },
    {
      "rid": "rdemo064",
      "id": "4297197",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-12T07:52:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 14,
          "m": 14,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "na",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Should have left a voicemail message",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-12T13:52:00.000Z"
    },
    {
      "rid": "rdemo079",
      "id": "4221619",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-11T13:07:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 14,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "na",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Missed an upsell opportunity",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-12T10:07:00.000Z"
    },
    {
      "rid": "rdemo078",
      "id": "4517087",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-11T12:54:00.000Z",
      "sc": 88,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 10,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo077",
      "id": "4399232",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-11T11:41:00.000Z",
      "sc": 89,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 4,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-12T06:41:00.000Z"
    },
    {
      "rid": "rdemo076",
      "id": "4888931",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-11T10:28:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "Great rapport with the customer",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-12T04:28:00.000Z"
    },
    {
      "rid": "rdemo075",
      "id": "4816491",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-11T09:15:00.000Z",
      "sc": 87,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 7,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo074",
      "id": "4976507",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-11T08:02:00.000Z",
      "sc": 94,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Should have left a voicemail message",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-12T00:02:00.000Z"
    },
    {
      "rid": "rdemo073",
      "id": "4439617",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-11T07:49:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-11T22:49:00.000Z"
    },
    {
      "rid": "rdemo072",
      "id": "4999125",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-11T06:36:00.000Z",
      "sc": 94,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo080",
      "id": "4121401",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-10T14:20:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-10T16:20:00.000Z"
    },
    {
      "rid": "rdemo087",
      "id": "4064787",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-10T12:51:00.000Z",
      "sc": 94,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo086",
      "id": "4993320",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-10T11:38:00.000Z",
      "sc": 94,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 4,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "Great rapport with the customer",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-10T19:38:00.000Z"
    },
    {
      "rid": "rdemo085",
      "id": "4531202",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-10T10:25:00.000Z",
      "sc": 94,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 9,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "disputed",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-10T17:25:00.000Z",
      "dp": {
        "status": "open",
        "at": "2026-10-10T10:25:00.000Z",
        "msgs": [
          {
            "u": "i.schmidt",
            "n": "Ivan Schmidt",
            "r": "agent",
            "t": "I do not agree with this score. Could we go through the call again?",
            "at": "2026-10-10T10:25:00.000Z"
          }
        ]
      }
    },
    {
      "rid": "rdemo084",
      "id": "4445017",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-10T09:12:00.000Z",
      "sc": 94,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 9,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Should have left a voicemail message",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo083",
      "id": "4688685",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-10T08:59:00.000Z",
      "sc": 72,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 4,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 0,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 6,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "red",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-10T13:59:00.000Z"
    },
    {
      "rid": "rdemo082",
      "id": "4270895",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-10T07:46:00.000Z",
      "sc": 87,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 4,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-10T11:46:00.000Z"
    },
    {
      "rid": "rdemo081",
      "id": "4313140",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-10T06:33:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 14,
          "m": 14,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "green",
      "cp": "beta fr regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo089",
      "id": "4452491",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-09T14:17:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Missed an upsell opportunity",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-10T01:17:00.000Z"
    },
    {
      "rid": "rdemo088",
      "id": "4931900",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-09T13:04:00.000Z",
      "sc": 93,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-09T23:04:00.000Z"
    },
    {
      "rid": "rdemo095",
      "id": "4052885",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-09T11:35:00.000Z",
      "sc": 90,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 11,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-10T04:35:00.000Z"
    },
    {
      "rid": "rdemo094",
      "id": "4845986",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-09T10:22:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Should have left a voicemail message",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-10T02:22:00.000Z"
    },
    {
      "rid": "rdemo093",
      "id": "4350687",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-09T09:09:00.000Z",
      "sc": 81,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 10,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo092",
      "id": "4809073",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-09T08:56:00.000Z",
      "sc": 88,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-09T22:56:00.000Z"
    },
    {
      "rid": "rdemo091",
      "id": "4074488",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-09T07:43:00.000Z",
      "sc": 88,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 9,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-09T20:43:00.000Z"
    },
    {
      "rid": "rdemo090",
      "id": "4411951",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-09T06:30:00.000Z",
      "sc": 93,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo098",
      "id": "4907177",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-08T14:14:00.000Z",
      "sc": 94,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 4,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-09T10:14:00.000Z"
    },
    {
      "rid": "rdemo097",
      "id": "4049737",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-08T13:01:00.000Z",
      "sc": 85.4,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 11,
          "m": 11,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "na",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-09T08:01:00.000Z"
    },
    {
      "rid": "rdemo096",
      "id": "4062722",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-08T12:48:00.000Z",
      "sc": 89,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 10,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "Great rapport with the customer",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo103",
      "id": "4938567",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-08T10:19:00.000Z",
      "sc": 87,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-08T15:19:00.000Z"
    },
    {
      "rid": "rdemo102",
      "id": "4361123",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-08T09:06:00.000Z",
      "sc": 95,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 10,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "disputed",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null,
      "dp": {
        "status": "open",
        "at": "2026-10-08T09:06:00.000Z",
        "msgs": [
          {
            "u": "s.blanc",
            "n": "Sandra Blanc",
            "r": "agent",
            "t": "I do not agree with this score. Could we go through the call again?",
            "at": "2026-10-08T09:06:00.000Z"
          }
        ]
      }
    },
    {
      "rid": "rdemo101",
      "id": "4058886",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-08T08:53:00.000Z",
      "sc": 88.3,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 14,
          "m": 14,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 10,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-08T11:53:00.000Z"
    },
    {
      "rid": "rdemo100",
      "id": "4098895",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-08T07:40:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 11,
          "m": 11,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "na",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-08T09:40:00.000Z"
    },
    {
      "rid": "rdemo099",
      "id": "4861222",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-08T06:27:00.000Z",
      "sc": 89.2,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 4,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 11,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 13,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Missed an upsell opportunity",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo107",
      "id": "4281672",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-07T14:11:00.000Z",
      "sc": 93,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-07T23:11:00.000Z"
    },
    {
      "rid": "rdemo106",
      "id": "4745709",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-07T13:58:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "Great rapport with the customer",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-07T21:58:00.000Z"
    },
    {
      "rid": "rdemo105",
      "id": "4661131",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-07T12:45:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "green",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo104",
      "id": "4218436",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-07T11:32:00.000Z",
      "sc": 86,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 6,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": "Could be improved here"
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 0,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Should have left a voicemail message",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-07T17:32:00.000Z"
    },
    {
      "rid": "rdemo111",
      "id": "4998567",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-07T09:03:00.000Z",
      "sc": 89,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 11,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": "Could be improved here"
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo110",
      "id": "4230515",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-07T08:50:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-07T20:50:00.000Z"
    },
    {
      "rid": "rdemo109",
      "id": "4491129",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-07T07:37:00.000Z",
      "sc": 84.9,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 6,
          "m": 13,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Missed an upsell opportunity",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-07T18:37:00.000Z"
    },
    {
      "rid": "rdemo108",
      "id": "4304292",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-07T06:24:00.000Z",
      "sc": 88,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo116",
      "id": "4530224",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-06T14:08:00.000Z",
      "sc": 86,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "Great rapport with the customer",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-07T08:08:00.000Z"
    },
    {
      "rid": "rdemo115",
      "id": "4998826",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-06T13:55:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-07T06:55:00.000Z"
    },
    {
      "rid": "rdemo114",
      "id": "4353895",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-06T12:42:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "green",
      "cp": "omega fr new 0-30",
      "cm": "Should have left a voicemail message",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo113",
      "id": "4740479",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-06T11:29:00.000Z",
      "sc": 81.6,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 4,
          "m": 4,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 13,
          "m": 13,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "na",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 11,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 0,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-07T02:29:00.000Z"
    },
    {
      "rid": "rdemo112",
      "id": "4542570",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-06T10:16:00.000Z",
      "sc": 93.6,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 4,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 9,
          "m": 9,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-07T00:16:00.000Z"
    },
    {
      "rid": "rdemo119",
      "id": "4941129",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-06T08:47:00.000Z",
      "sc": 93,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "disputed",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Missed an upsell opportunity",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-07T05:47:00.000Z",
      "dp": {
        "status": "open",
        "at": "2026-10-06T08:47:00.000Z",
        "msgs": [
          {
            "u": "r.shishkov",
            "n": "Rene Shishkov",
            "r": "agent",
            "t": "I do not agree with this score. Could we go through the call again?",
            "at": "2026-10-06T08:47:00.000Z"
          }
        ]
      }
    },
    {
      "rid": "rdemo118",
      "id": "4821433",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-06T07:34:00.000Z",
      "sc": 95,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 10,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-07T03:34:00.000Z"
    },
    {
      "rid": "rdemo117",
      "id": "4465094",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-06T06:21:00.000Z",
      "sc": 83,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 6,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo125",
      "id": "4104320",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-05T14:05:00.000Z",
      "sc": 96,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 11,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-05T21:05:00.000Z"
    },
    {
      "rid": "rdemo124",
      "id": "4947141",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-05T13:52:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Should have left a voicemail message",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-05T19:52:00.000Z"
    },
    {
      "rid": "rdemo123",
      "id": "4223514",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-05T12:39:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 14,
          "m": 14,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "na",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "green",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo122",
      "id": "4079883",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-05T11:26:00.000Z",
      "sc": 95.7,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 5,
          "m": 9,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-05T15:26:00.000Z"
    },
    {
      "rid": "rdemo121",
      "id": "4186285",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-05T10:13:00.000Z",
      "sc": 91,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 6,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 10,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-05T13:13:00.000Z"
    },
    {
      "rid": "rdemo120",
      "id": "4248191",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-05T09:00:00.000Z",
      "sc": 94,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo127",
      "id": "4368540",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-05T07:31:00.000Z",
      "sc": 88,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 0,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-05T16:31:00.000Z"
    },
    {
      "rid": "rdemo126",
      "id": "4834089",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-05T06:18:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "green",
      "cp": "beta fr regulars 30-60",
      "cm": "Great rapport with the customer",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo134",
      "id": "4063967",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-04T14:02:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Should have left a voicemail message",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-05T06:02:00.000Z"
    },
    {
      "rid": "rdemo133",
      "id": "4338702",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-04T13:49:00.000Z",
      "sc": 87,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 9,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-05T04:49:00.000Z"
    },
    {
      "rid": "rdemo132",
      "id": "4017315",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-04T12:36:00.000Z",
      "sc": 85,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 11,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 0,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo131",
      "id": "4010917",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-04T11:23:00.000Z",
      "sc": 94,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 9,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-05T00:23:00.000Z"
    },
    {
      "rid": "rdemo130",
      "id": "4678699",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-04T10:10:00.000Z",
      "sc": 86.2,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 4,
          "m": 4,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-04T22:10:00.000Z"
    },
    {
      "rid": "rdemo129",
      "id": "4295173",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-04T09:57:00.000Z",
      "sc": 83,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 11,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 7,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Missed an upsell opportunity",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo128",
      "id": "4031616",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-04T08:44:00.000Z",
      "sc": 87.5,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 5,
          "m": 11,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "na",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-04T18:44:00.000Z"
    },
    {
      "rid": "rdemo135",
      "id": "4399683",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-04T06:15:00.000Z",
      "sc": 94,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo143",
      "id": "4688391",
      "agent": "r.shishkov",
      "agn": "Rene Shishkov",
      "tid": "t-b2b",
      "d": "2026-10-03T14:59:00.000Z",
      "sc": 94,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 9,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-03T19:59:00.000Z"
    },
    {
      "rid": "rdemo142",
      "id": "4619064",
      "agent": "s.blanc",
      "agn": "Sandra Blanc",
      "tid": "t-b2c",
      "d": "2026-10-03T13:46:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-03T17:46:00.000Z"
    },
    {
      "rid": "rdemo141",
      "id": "4062326",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-03T12:33:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 14,
          "m": 14,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "green",
      "cp": "beta fr regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo140",
      "id": "4520879",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-03T11:20:00.000Z",
      "sc": 92.5,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 13,
          "m": 13,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "na",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-03T13:20:00.000Z"
    },
    {
      "rid": "rdemo139",
      "id": "4644758",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-03T10:07:00.000Z",
      "sc": 93,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Missed an upsell opportunity",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-04T07:07:00.000Z"
    },
    {
      "rid": "rdemo138",
      "id": "4423598",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-03T09:54:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 13,
          "m": 13,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "na",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "green",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo137",
      "id": "4113213",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-03T08:41:00.000Z",
      "sc": 93,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-04T03:41:00.000Z"
    },
    {
      "rid": "rdemo136",
      "id": "4564416",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-03T07:28:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "disputed",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "Great rapport with the customer",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-04T01:28:00.000Z",
      "dp": {
        "status": "open",
        "at": "2026-10-03T07:28:00.000Z",
        "msgs": [
          {
            "u": "d.petrov",
            "n": "Deyan Petrov",
            "r": "agent",
            "t": "I do not agree with this score. Could we go through the call again?",
            "at": "2026-10-03T07:28:00.000Z"
          }
        ]
      }
    },
    {
      "rid": "rdemo149",
      "id": "4699449",
      "agent": "i.schmidt",
      "agn": "Ivan Schmidt",
      "tid": "t-support",
      "d": "2026-10-02T11:17:00.000Z",
      "sc": 87,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 7,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Missed an upsell opportunity",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-02T22:17:00.000Z"
    },
    {
      "rid": "rdemo148",
      "id": "4622680",
      "agent": "s.mensah",
      "agn": "Sofia Mensah",
      "tid": "t-b2b",
      "d": "2026-10-02T10:04:00.000Z",
      "sc": 96,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 11,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "delta en regulars 30-60",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-02T20:04:00.000Z"
    },
    {
      "rid": "rdemo147",
      "id": "4561985",
      "agent": "k.dimova",
      "agn": "Kamelia Dimova",
      "tid": "t-b2c",
      "d": "2026-10-02T09:51:00.000Z",
      "sc": 82,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 9,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": "Could be improved here"
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 0,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 13,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "n",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "gamma en vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": null
    },
    {
      "rid": "rdemo146",
      "id": "4942614",
      "agent": "c.kemp",
      "agn": "Charles Kemp",
      "tid": "t-support",
      "d": "2026-10-02T08:38:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "beta fr regulars 30-60",
      "cm": "Great rapport with the customer",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-02T16:38:00.000Z"
    },
    {
      "rid": "rdemo145",
      "id": "4878547",
      "agent": "m.todorova",
      "agn": "Maria Todorova",
      "tid": "t-b2b",
      "d": "2026-10-02T07:25:00.000Z",
      "sc": 100,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "alpha fr vip 120+",
      "cm": "",
      "lk": "",
      "rl": "",
      "rv": "Marc Duval",
      "by": "demo",
      "demo": true,
      "seen": "2026-10-02T14:25:00.000Z"
    },
    {
      "rid": "rdemo144",
      "id": "4900386",
      "agent": "d.petrov",
      "agn": "Deyan Petrov",
      "tid": "t-b2c",
      "d": "2026-10-02T06:12:00.000Z",
      "sc": 88,
      "cs": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "e": 20,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "e": 15,
          "m": 15,
          "z": 0,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "e": 5,
          "m": 5,
          "z": 0,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "e": 14,
          "m": 20,
          "z": 0,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false,
              "a": "n",
              "cm": ""
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": false,
          "e": 10,
          "m": 10,
          "z": 0,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false,
              "a": "y",
              "cm": ""
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false,
              "a": "y",
              "cm": ""
            }
          ]
        }
      ],
      "scid": "sc-default",
      "scn": "Standard Scorecard - 7 categories",
      "st": "ok",
      "fl": "",
      "cp": "omega fr new 0-30",
      "cm": "Should have left a voicemail message",
      "lk": "",
      "rl": "",
      "rv": "Lena Hart",
      "by": "demo",
      "demo": true,
      "seen": null
    }
  ],
  "scorecards": [
    {
      "id": "sc-default",
      "name": "Standard Scorecard - 7 categories",
      "desc": "Evaluation criteria for sales and support calls",
      "cats": [
        {
          "n": "Greeting & Introduction",
          "k": false,
          "it": [
            {
              "t": "Greeted the customer warmly and introduced themselves and the company",
              "p": 6,
              "k": false
            },
            {
              "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
              "p": 4,
              "k": false
            }
          ]
        },
        {
          "n": "Vocabulary & Professionalism",
          "k": false,
          "it": [
            {
              "t": "Used clear, respectful language with no jargon, slang or banned phrases",
              "p": 6,
              "k": false
            },
            {
              "t": "Acknowledged the customer's recent activity or good news in a genuine way",
              "p": 7,
              "k": false
            },
            {
              "t": "Asked open questions to understand what the customer wants",
              "p": 7,
              "k": false
            }
          ]
        },
        {
          "n": "Empathy & Active Listening",
          "k": false,
          "it": [
            {
              "t": "Listened without interrupting and gave the customer space to speak",
              "p": 5,
              "k": false
            },
            {
              "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
              "p": 6,
              "k": false
            },
            {
              "t": "Handled sensitive situations with care",
              "p": 4,
              "k": false
            }
          ]
        },
        {
          "n": "Documentation & Reasoning",
          "k": false,
          "it": [
            {
              "t": "Selected the correct disposition status in the CRM",
              "p": 5,
              "k": false
            }
          ]
        },
        {
          "n": "Process Adherence",
          "k": false,
          "it": [
            {
              "t": "Sent the follow-up SMS or email required by the workflow",
              "p": 7,
              "k": true
            },
            {
              "t": "Confirmed the correct offer was set up before the call",
              "p": 7,
              "k": false
            },
            {
              "t": "Confirmed the next step clearly before ending the call",
              "p": 6,
              "k": false
            }
          ]
        },
        {
          "n": "Persuasion & Objection Handling",
          "k": false,
          "it": [
            {
              "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
              "p": 7,
              "k": false
            },
            {
              "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
              "p": 7,
              "k": false
            },
            {
              "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
              "p": 6,
              "k": false
            }
          ]
        },
        {
          "n": "Closing & Positive Outcome",
          "k": true,
          "it": [
            {
              "t": "Closed the call politely and encouraged further engagement",
              "p": 6,
              "k": false
            },
            {
              "t": "Recapped the actions taken or agreed during the call when needed",
              "p": 4,
              "k": false
            }
          ]
        }
      ]
    }
  ],
  "notifications": [
    {
      "id": "n645b08e283",
      "to": "c.kemp",
      "type": "task",
      "text": "New task from your one-to-one: test",
      "at": "2026-10-21T07:07:29.298Z",
      "read": false,
      "task": "k66f5f52187"
    },
    {
      "id": "ne73716afe6",
      "to": "d.petrov",
      "type": "review",
      "text": "You received a new call review for Lead #1234656 (score 100%)",
      "at": "2026-10-21T06:43:09.268Z",
      "read": false,
      "rid": "rb8870e57a335",
      "lead": "1234656"
    },
    {
      "id": "n07856f21fa",
      "to": "d.petrov",
      "type": "review",
      "text": "You received a new call review for Lead #123456 (score 100%)",
      "at": "2026-10-21T06:42:47.173Z",
      "read": false,
      "rid": "r7adc54643e07",
      "lead": "123456"
    },
    {
      "id": "n97a0003a6c",
      "to": "d.petrov",
      "type": "resolved",
      "text": "Your dispute for Lead #4152573 was resolved: score changed",
      "at": "2026-10-21T06:37:10.753Z",
      "read": false,
      "rid": "rdemo000",
      "lead": "4152573"
    },
    {
      "id": "n37a2de45b5",
      "to": "d.petrov",
      "type": "review",
      "text": "Your review for Lead #4152573 was updated (score 87%)",
      "at": "2026-10-21T06:35:37.350Z",
      "read": false,
      "rid": "rdemo000",
      "lead": "4152573"
    },
    {
      "id": "n0893ae2cb3",
      "to": "d.petrov",
      "type": "msg",
      "text": "Gabriela Georgieva wrote in the dispute for Lead #4152573: \"okay\"",
      "at": "2026-10-21T06:34:04.822Z",
      "read": false,
      "rid": "rdemo000",
      "lead": "4152573"
    },
    {
      "id": "nf583a7e6af",
      "to": "d.petrov",
      "type": "remind",
      "text": "Reminder: please open your call review for Lead #4152573",
      "at": "2026-10-21T06:32:33.979Z",
      "read": false,
      "rid": "rdemo000",
      "lead": "4152573"
    }
  ],
  "registrations": [
    {
      "id": "g1ca26551b1",
      "username": "gabriela.registration",
      "name": "Gabriela Registration",
      "email": "nikolovagabriela_1@yahoo.com",
      "hash": "$2b$10$M6BfLBBxAZKkb.SR23iY4.88zNy8w2L3TbqryqwqGkix9xqPs61I2",
      "at": "2026-10-22T12:03:20.022Z",
      "status": "approved",
      "by": "g.georrgieva",
      "decided": "2026-10-22T12:04:35.404Z"
    }
  ],
  "tasks": [
    {
      "id": "kdemo0",
      "group": "gdemo0",
      "title": "Listen to 3 recorded calls",
      "desc": "Demo task",
      "type": "task",
      "priority": "low",
      "points": 10,
      "due": "2026-10-19",
      "status": "todo",
      "assignee": "d.petrov",
      "labels": [
        "demo"
      ],
      "checklist": [
        {
          "t": "Step 1",
          "done": false
        },
        {
          "t": "Step 2",
          "done": false
        }
      ],
      "created": "2026-10-20T13:33:29.989Z",
      "by": "g.pencheva",
      "completed": null,
      "demo": true
    },
    {
      "id": "kdemo1",
      "group": "gdemo1",
      "title": "Update your CRM notes",
      "desc": "Demo task",
      "type": "mission",
      "priority": "med",
      "points": 15,
      "due": "2026-10-20",
      "status": "doing",
      "assignee": "m.todorova",
      "labels": [
        "demo"
      ],
      "checklist": [
        {
          "t": "Step 1",
          "done": false
        },
        {
          "t": "Step 2",
          "done": false
        }
      ],
      "created": "2026-10-20T13:33:29.989Z",
      "by": "g.pencheva",
      "completed": null,
      "demo": true
    },
    {
      "id": "kdemo2",
      "group": "gdemo2",
      "title": "Read the objection guide",
      "desc": "Demo task",
      "type": "task",
      "priority": "high",
      "points": 20,
      "due": "2026-10-21",
      "status": "review",
      "assignee": "c.kemp",
      "labels": [
        "demo"
      ],
      "checklist": [
        {
          "t": "Step 1",
          "done": false
        },
        {
          "t": "Step 2",
          "done": false
        }
      ],
      "created": "2026-10-20T13:33:29.989Z",
      "by": "g.pencheva",
      "completed": null,
      "demo": true
    },
    {
      "id": "kdemo3",
      "group": "gdemo3",
      "title": "Prepare feedback for your one-to-one",
      "desc": "Demo task",
      "type": "mission",
      "priority": "low",
      "points": 25,
      "due": "2026-10-22",
      "status": "done",
      "assignee": "k.dimova",
      "labels": [
        "demo"
      ],
      "checklist": [
        {
          "t": "Step 1",
          "done": true
        },
        {
          "t": "Step 2",
          "done": false
        }
      ],
      "created": "2026-10-20T13:33:29.989Z",
      "by": "g.pencheva",
      "completed": "2026-10-20T13:33:29.989Z",
      "demo": true
    },
    {
      "id": "kdemo4",
      "group": "gdemo4",
      "title": "Practice the closing script",
      "desc": "Demo task",
      "type": "task",
      "priority": "med",
      "points": 30,
      "due": "2026-10-23",
      "status": "todo",
      "assignee": "s.mensah",
      "labels": [
        "demo"
      ],
      "checklist": [
        {
          "t": "Step 1",
          "done": false
        },
        {
          "t": "Step 2",
          "done": false
        }
      ],
      "created": "2026-10-20T13:33:29.989Z",
      "by": "g.pencheva",
      "completed": null,
      "demo": true
    },
    {
      "id": "kdemo5",
      "group": "gdemo5",
      "title": "Shadow a senior colleague",
      "desc": "Demo task",
      "type": "mission",
      "priority": "high",
      "points": 35,
      "due": "2026-10-24",
      "status": "doing",
      "assignee": "i.schmidt",
      "labels": [
        "demo"
      ],
      "checklist": [
        {
          "t": "Step 1",
          "done": false
        },
        {
          "t": "Step 2",
          "done": false
        }
      ],
      "created": "2026-10-20T13:33:29.989Z",
      "by": "g.pencheva",
      "completed": null,
      "demo": true
    },
    {
      "id": "kc22ccf2815",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-20",
      "status": "todo",
      "assignee": "d.petrov",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-20T14:37:07.039Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-20:d.petrov",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "kf389e9e6ca",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-20",
      "status": "todo",
      "assignee": "m.todorova",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-20T14:37:07.039Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-20:m.todorova",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "k1d9781b636",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-20",
      "status": "todo",
      "assignee": "c.kemp",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-20T14:37:07.039Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-20:c.kemp",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "k248149e932",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-20",
      "status": "todo",
      "assignee": "k.dimova",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-20T14:37:07.039Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-20:k.dimova",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "kadcaf40d1d",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-20",
      "status": "todo",
      "assignee": "s.mensah",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-20T14:37:07.039Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-20:s.mensah",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "kf5513bda85",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-20",
      "status": "todo",
      "assignee": "i.schmidt",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-20T14:37:07.039Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-20:i.schmidt",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "k08da295021",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-20",
      "status": "todo",
      "assignee": "s.blanc",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-20T14:37:07.039Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-20:s.blanc",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "kf6b401e6a3",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-20",
      "status": "todo",
      "assignee": "r.shishkov",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-20T14:37:07.039Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-20:r.shishkov",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "k8fdca437d3",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-21",
      "status": "todo",
      "assignee": "d.petrov",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-21T06:14:58.092Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-21:d.petrov",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "kf9e4dc51ec",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-21",
      "status": "todo",
      "assignee": "m.todorova",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-21T06:14:58.092Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-21:m.todorova",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "k9a5d91b0bf",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-21",
      "status": "todo",
      "assignee": "c.kemp",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-21T06:14:58.092Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-21:c.kemp",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "kcc1f7b954a",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-21",
      "status": "todo",
      "assignee": "k.dimova",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-21T06:14:58.092Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-21:k.dimova",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "k33951e229a",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-21",
      "status": "todo",
      "assignee": "s.mensah",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-21T06:14:58.092Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-21:s.mensah",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "kf1cd623bc4",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-21",
      "status": "todo",
      "assignee": "i.schmidt",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-21T06:14:58.092Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-21:i.schmidt",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "kad9288e4aa",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-21",
      "status": "todo",
      "assignee": "s.blanc",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-21T06:14:58.092Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-21:s.blanc",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "k7920c4187b",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-21",
      "status": "todo",
      "assignee": "r.shishkov",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-21T06:14:58.092Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-21:r.shishkov",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "k66f5f52187",
      "group": "gef17ccf4",
      "title": "test",
      "desc": "From: test",
      "type": "task",
      "priority": "med",
      "points": 0,
      "due": "2026-10-22",
      "status": "todo",
      "assignee": "c.kemp",
      "labels": [
        "coaching"
      ],
      "checklist": [],
      "created": "2026-10-21T07:07:29.298Z",
      "by": "g.georrgieva",
      "completed": null
    },
    {
      "id": "k5d84f37f2c",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-21",
      "status": "todo",
      "assignee": "v.petrova",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-21T09:29:43.440Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-21:v.petrova",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "k7361732457",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-22",
      "status": "todo",
      "assignee": "v.petrova",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-22T12:04:10.957Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-22:v.petrova",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "k97d484b76f",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-22",
      "status": "todo",
      "assignee": "d.petrov",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-22T12:04:10.957Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-22:d.petrov",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "k45c655612b",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-22",
      "status": "todo",
      "assignee": "m.todorova",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-22T12:04:10.958Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-22:m.todorova",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "k13a43179c9",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-22",
      "status": "todo",
      "assignee": "c.kemp",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-22T12:04:10.958Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-22:c.kemp",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "k545472a7ff",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-22",
      "status": "todo",
      "assignee": "k.dimova",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-22T12:04:10.958Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-22:k.dimova",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "k43fa96f3b4",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-22",
      "status": "todo",
      "assignee": "s.mensah",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-22T12:04:10.958Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-22:s.mensah",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "k49a2132d30",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-22",
      "status": "todo",
      "assignee": "i.schmidt",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-22T12:04:10.958Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-22:i.schmidt",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "kb42a48c8e5",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-22",
      "status": "todo",
      "assignee": "s.blanc",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-22T12:04:10.958Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-22:s.blanc",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "k139466d5c2",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-22",
      "status": "todo",
      "assignee": "r.shishkov",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-22T12:04:10.958Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-22:r.shishkov",
      "tpl": "pdemo1",
      "completed": null
    },
    {
      "id": "kc797e67428",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "type": "mission",
      "priority": "med",
      "points": 5,
      "due": "2026-10-22",
      "status": "todo",
      "assignee": "gabriela.registration",
      "labels": [
        "daily"
      ],
      "checklist": [],
      "created": "2026-10-22T12:07:17.559Z",
      "by": "g.pencheva",
      "key": "pdemo1:2026-10-22:gabriela.registration",
      "tpl": "pdemo1",
      "completed": null
    }
  ],
  "taskTpl": [
    {
      "id": "pdemo1",
      "title": "Daily mission: review yesterday's feedback",
      "desc": "Open your latest review and write one thing you will do differently.",
      "points": 5,
      "priority": "med",
      "freq": "daily",
      "weekday": 1,
      "users": [],
      "teams": [
        "t-b2c",
        "t-b2b",
        "t-support"
      ],
      "checklist": [],
      "labels": [
        "daily"
      ],
      "active": true,
      "by": "g.pencheva",
      "created": "2026-10-20T13:33:29.989Z",
      "demo": true
    }
  ],
  "sessions": [
    {
      "id": "s50be4c69c3",
      "kind": "o2o",
      "date": "2026-10-21",
      "title": "test",
      "agents": [
        "c.kemp",
        "d.petrov"
      ],
      "topics": [
        "test"
      ],
      "focus": [
        "Greeting & Introduction"
      ],
      "notes": "test",
      "goals": "test",
      "actions": [
        {
          "t": "test",
          "owner": "c.kemp",
          "due": "2026-10-22",
          "done": true,
          "taskId": "k66f5f52187"
        }
      ],
      "follow": "2026-11-21",
      "status": "done",
      "by": "g.georrgieva",
      "byName": "Gabriela Georgieva",
      "created": "2026-10-21T07:07:29.297Z",
      "updated": "2026-10-21T07:07:50.708Z"
    },
    {
      "id": "sdemo1",
      "kind": "coaching",
      "date": "2026-10-17",
      "title": "Objection handling workshop",
      "agents": [
        "d.petrov",
        "m.todorova",
        "c.kemp"
      ],
      "topics": [
        "Persuasion & Objection Handling"
      ],
      "focus": [
        "Persuasion & Objection Handling"
      ],
      "notes": "Role-played price objections. Good progress.",
      "goals": "Reduce \"No\" answers on objection items",
      "actions": [
        {
          "t": "Practice 3 objections per day",
          "owner": "d.petrov",
          "due": "2026-10-24",
          "done": false,
          "taskId": ""
        }
      ],
      "follow": "2026-11-03",
      "status": "done",
      "by": "i.marinova",
      "byName": "Iva Marinova",
      "created": "2026-10-20T13:33:29.989Z",
      "updated": "2026-10-20T13:33:29.989Z",
      "demo": true
    },
    {
      "id": "sdemo2",
      "kind": "o2o",
      "date": "2026-10-19",
      "title": "One-to-one",
      "agents": [
        "m.todorova"
      ],
      "topics": [],
      "focus": [],
      "notes": "Talked about workload and goals.",
      "goals": "Raise the pass rate to 90%",
      "actions": [],
      "follow": "2026-11-03",
      "status": "done",
      "by": "g.pencheva",
      "byName": "Gabriela Pencheva",
      "created": "2026-10-20T13:33:29.989Z",
      "updated": "2026-10-20T13:33:29.989Z",
      "demo": true
    }
  ],
  "calibrations": [
    {
      "id": "cdemo1",
      "title": "Monthly calibration",
      "date": "2026-10-22",
      "status": "planned",
      "participants": [
        "g.pencheva",
        "i.marinova"
      ],
      "teams": [
        "t-b2c",
        "t-b2b"
      ],
      "reviews": [],
      "notes": "Agenda: scoring of empathy, objection handling.",
      "entries": {},
      "decisions": [
        {
          "t": "Agree on how to score \"Handled sensitive situations\"",
          "owner": "i.marinova",
          "due": "2026-10-27",
          "done": false
        }
      ],
      "by": "g.pencheva",
      "created": "2026-10-20T13:33:29.989Z",
      "updated": "2026-10-20T13:33:29.989Z",
      "demo": true
    }
  ],
  "kbFolders": [
    {
      "id": "fdemo29cb",
      "name": "Onboarding",
      "parent": "",
      "color": "#2563eb",
      "icon": "📘",
      "desc": "Everything a new agent reads in the first week",
      "req": {
        "on": true,
        "teams": []
      },
      "created": "2026-10-20T13:33:29.989Z",
      "demo": true
    },
    {
      "id": "fdemoe9f4",
      "name": "Sales skills",
      "parent": "",
      "color": "#7c3aed",
      "icon": "💡",
      "desc": "Techniques for better conversations",
      "req": {
        "on": false,
        "teams": []
      },
      "created": "2026-10-20T13:33:29.989Z",
      "demo": true
    },
    {
      "id": "fdemo1c6b",
      "name": "Objection handling",
      "parent": "fdemoe9f4",
      "color": "#e11d48",
      "icon": "🎯",
      "desc": "",
      "req": {
        "on": false,
        "teams": []
      },
      "created": "2026-10-20T13:33:29.989Z",
      "demo": true
    }
  ],
  "kbArticles": [
    {
      "id": "ademo10bd",
      "title": "How to greet a customer",
      "folder": "fdemo29cb",
      "topics": [
        "Greeting & Introduction"
      ],
      "body": "## The first 10 seconds\n\nA warm greeting sets the tone for the whole call.\n\n- Smile before you pick up\n- Say your name and the company\n- Ask how you can help\n\n> Tip: match the energy of the customer, calm or upbeat.",
      "req": {
        "on": true,
        "teams": []
      },
      "quiz": {
        "pass": 70,
        "questions": [
          {
            "q": "What should you say in the first seconds?",
            "opts": [
              "Your name and the company",
              "Nothing until the customer speaks",
              "The price"
            ],
            "a": 0,
            "why": "Introduce yourself and the company."
          },
          {
            "q": "How should your energy be?",
            "opts": [
              "Always loud",
              "Matched to the customer",
              "Flat"
            ],
            "a": 1,
            "why": "Adapt tone to the customer."
          }
        ]
      },
      "author": "Iva Marinova",
      "authorU": "i.marinova",
      "created": "2026-10-20T13:33:29.989Z",
      "updated": "2026-10-20T13:33:29.989Z",
      "demo": true
    },
    {
      "id": "ademo3d39",
      "title": "Active listening checklist",
      "folder": "fdemo29cb",
      "topics": [
        "Empathy & Active Listening"
      ],
      "body": "## Listen first\n\n1. Let the customer finish\n2. Paraphrase the concern\n3. Use reassuring language\n\n**Never interrupt**, even if you know the answer.",
      "req": {
        "on": false,
        "teams": []
      },
      "quiz": null,
      "author": "Iva Marinova",
      "authorU": "i.marinova",
      "created": "2026-10-20T13:33:29.989Z",
      "updated": "2026-10-20T13:33:29.989Z",
      "demo": true
    },
    {
      "id": "ademo2f57",
      "title": "Handling \"it is too expensive\"",
      "folder": "fdemo1c6b",
      "topics": [
        "Persuasion & Objection Handling",
        "Price"
      ],
      "body": "## Steps\n\n1. Acknowledge the concern\n2. Ask what they compare it with\n3. Show the value, not a discount\n4. Confirm the next step\n\nSee also the closing checklist.",
      "req": {
        "on": false,
        "teams": []
      },
      "quiz": null,
      "author": "Iva Marinova",
      "authorU": "i.marinova",
      "created": "2026-10-20T13:33:29.989Z",
      "updated": "2026-10-20T13:33:29.989Z",
      "demo": true
    },
    {
      "id": "ademo6178",
      "title": "Closing the call well",
      "folder": "fdemoe9f4",
      "topics": [
        "Closing & Positive Outcome"
      ],
      "body": "## Closing\n\n- Recap what was agreed\n- Confirm the next contact\n- Thank the customer\n\n**Always** document the call in the CRM.",
      "req": {
        "on": false,
        "teams": []
      },
      "quiz": null,
      "author": "Iva Marinova",
      "authorU": "i.marinova",
      "created": "2026-10-20T13:33:29.989Z",
      "updated": "2026-10-20T13:33:29.989Z",
      "demo": true
    }
  ],
  "newsletters": [
    {
      "id": "ndemo1",
      "month": "2026-10",
      "title": "Monthly update",
      "intro": "Here is what changed this month in the knowledge base.",
      "items": [
        {
          "title": "New guide: handling price objections",
          "text": "A short guide with four steps.",
          "aid": "ademo2f57"
        },
        {
          "title": "Weekly quiz is live",
          "text": "Take it before Friday.",
          "aid": ""
        }
      ],
      "published": true,
      "by": "Iva Marinova",
      "created": "2026-10-20T13:33:29.989Z",
      "demo": true
    }
  ],
  "quizzes": [
    {
      "id": "qdemo1",
      "title": "Weekly quiz: listening and closing",
      "desc": "Five minutes, based on this week's articles",
      "kind": "weekly",
      "topics": [
        "Empathy & Active Listening"
      ],
      "articles": [
        "ademo3d39",
        "ademo2f57",
        "ademo6178"
      ],
      "pass": 70,
      "due": "2026-10-25",
      "assign": {
        "all": true,
        "teams": [],
        "users": []
      },
      "status": "published",
      "by": "Iva Marinova",
      "created": "2026-10-20T13:33:29.989Z",
      "demo": true,
      "questions": [
        {
          "q": "What do you do first when a customer raises a concern?",
          "opts": [
            "Interrupt with the solution",
            "Let them finish and paraphrase",
            "Change the subject"
          ],
          "a": 1,
          "why": "Listen first."
        },
        {
          "q": "What should you always do after a call?",
          "opts": [
            "Document it in the CRM",
            "Nothing",
            "Call back at once"
          ],
          "a": 0,
          "why": "Documentation matters."
        }
      ]
    }
  ],
  "attempts": [],
  "kbReads": {
    "g.georrgieva": {}
  },
  "settings": {
    "pass": 85,
    "teams": {},
    "layouts": {}
  },
  "teams": [
    {
      "id": "t-admin",
      "name": "Administration",
      "desc": "Admins, QA specialists, team leads and trainers",
      "languages": [],
      "skills": [],
      "region": "",
      "hours": "",
      "channels": [],
      "notes": "",
      "color": "#475569",
      "lead": "g.georrgieva",
      "system": true,
      "created": "2026-10-22T11:49:36.815Z"
    },
    {
      "id": "t-b2c",
      "name": "B2C",
      "desc": "Consumer sales and retention",
      "languages": [
        "English",
        "French"
      ],
      "skills": [
        "Sales",
        "Retention",
        "Objection handling"
      ],
      "region": "Europe",
      "hours": "08:00-17:00",
      "channels": [
        "Phone",
        "Chat"
      ],
      "lead": "g.pencheva",
      "color": "#2563eb",
      "notes": "",
      "created": "2026-10-19T13:10:08.638Z"
    },
    {
      "id": "t-b2b",
      "name": "B2B",
      "desc": "Business accounts and partnerships",
      "languages": [
        "English"
      ],
      "skills": [
        "Account management",
        "Negotiation"
      ],
      "region": "Europe",
      "hours": "09:00-18:00",
      "channels": [
        "Phone",
        "Email"
      ],
      "lead": "m.duval",
      "color": "#7c3aed",
      "notes": "",
      "created": "2026-10-19T13:10:08.638Z"
    },
    {
      "id": "t-40aeb9",
      "name": "Administration",
      "desc": "Management",
      "lead": "g.georrgieva",
      "languages": [
        "English"
      ],
      "skills": [
        "Trainer",
        "QA",
        "Lead"
      ],
      "region": "Europe",
      "hours": "24/7",
      "channels": [
        "Admin"
      ],
      "notes": "",
      "color": "#e11d48",
      "created": "2026-10-21T09:14:13.121Z"
    }
  ],
  "boot": 5,
  "oldTeams": {
    "t-support": "VIP"
  },
  "skills": [
    "Sales",
    "Retention",
    "Objection handling",
    "Account management",
    "Negotiation",
    "Troubleshooting",
    "Empathy",
    "Upselling",
    "Coaching",
    "Quality assurance",
    "Balenciaga",
    "Nike",
    "Asics",
    "Trainer",
    "QA",
    "Lead"
  ],
  "languages": [
    "English",
    "French",
    "German",
    "Spanish",
    "Italian",
    "Bulgarian"
  ],
  "rootCauses": [
    {
      "id": "rc1",
      "name": "Knowledge gap",
      "desc": "The agent did not know the answer or the product",
      "active": true
    },
    {
      "id": "rc2",
      "name": "Process unclear",
      "desc": "The process or policy is unclear or was not followed",
      "active": true
    },
    {
      "id": "rc3",
      "name": "Tool or system issue",
      "desc": "A system problem got in the way",
      "active": true
    },
    {
      "id": "rc4",
      "name": "Soft skill",
      "desc": "Tone, empathy or listening needs work",
      "active": true
    },
    {
      "id": "rc5",
      "name": "Customer behaviour",
      "desc": "A difficult situation outside the agent's control",
      "active": true
    },
    {
      "id": "rc6",
      "name": "Workload / time pressure",
      "desc": "The agent was rushed",
      "active": true
    }
  ],
  "categories": [
    {
      "id": "cat1",
      "n": "Greeting & Introduction",
      "k": false,
      "it": [
        {
          "t": "Greeted the customer warmly and introduced themselves and the company",
          "p": 6,
          "k": false
        },
        {
          "t": "Adapted tone and energy to the customer's mood (calm, serious, upbeat)",
          "p": 4,
          "k": false
        }
      ],
      "desc": "",
      "active": true
    },
    {
      "id": "cat2",
      "n": "Vocabulary & Professionalism",
      "k": false,
      "it": [
        {
          "t": "Used clear, respectful language with no jargon, slang or banned phrases",
          "p": 6,
          "k": false
        },
        {
          "t": "Acknowledged the customer's recent activity or good news in a genuine way",
          "p": 7,
          "k": false
        },
        {
          "t": "Asked open questions to understand what the customer wants",
          "p": 7,
          "k": false
        }
      ],
      "desc": "",
      "active": true
    },
    {
      "id": "cat3",
      "n": "Empathy & Active Listening",
      "k": false,
      "it": [
        {
          "t": "Listened without interrupting and gave the customer space to speak",
          "p": 5,
          "k": false
        },
        {
          "t": "Used empathetic, reassuring language and paraphrased the customer's concerns",
          "p": 6,
          "k": false
        },
        {
          "t": "Handled sensitive situations with care",
          "p": 4,
          "k": false
        }
      ],
      "desc": "",
      "active": true
    },
    {
      "id": "cat4",
      "n": "Documentation & Reasoning",
      "k": false,
      "it": [
        {
          "t": "Selected the correct disposition status in the CRM",
          "p": 5,
          "k": false
        }
      ],
      "desc": "",
      "active": true
    },
    {
      "id": "cat5",
      "n": "Process Adherence",
      "k": false,
      "it": [
        {
          "t": "Sent the follow-up SMS or email required by the workflow",
          "p": 7,
          "k": true
        },
        {
          "t": "Confirmed the correct offer was set up before the call",
          "p": 7,
          "k": false
        },
        {
          "t": "Confirmed the next step clearly before ending the call",
          "p": 6,
          "k": false
        }
      ],
      "desc": "",
      "active": true
    },
    {
      "id": "cat6",
      "n": "Persuasion & Objection Handling",
      "k": false,
      "it": [
        {
          "t": "Explored the customer's interest in continuing and framed a clear next opportunity",
          "p": 7,
          "k": false
        },
        {
          "t": "Stayed calm and encouraging when the customer hesitated; handled objections professionally",
          "p": 7,
          "k": false
        },
        {
          "t": "Suggested a suitable alternative and confirmed when the next conversation would take place",
          "p": 6,
          "k": false
        }
      ],
      "desc": "",
      "active": true
    },
    {
      "id": "cat7",
      "n": "Closing & Positive Outcome",
      "k": true,
      "it": [
        {
          "t": "Closed the call politely and encouraged further engagement",
          "p": 6,
          "k": false
        },
        {
          "t": "Recapped the actions taken or agreed during the call when needed",
          "p": 4,
          "k": false
        }
      ],
      "desc": "",
      "active": true
    }
  ],
  "autoCats": [
    {
      "id": "ac1",
      "desc": "",
      "weight": 1,
      "enabled": true,
      "system": true,
      "name": "Greeting",
      "maps": "Greeting & Introduction",
      "pos": [
        "hello",
        "good morning",
        "good afternoon",
        "welcome",
        "my name is",
        "thank you for calling"
      ],
      "neg": []
    },
    {
      "id": "ac2",
      "desc": "",
      "weight": 1,
      "enabled": true,
      "system": true,
      "name": "Empathy",
      "maps": "Empathy & Active Listening",
      "pos": [
        "i understand",
        "i am sorry",
        "i'm sorry",
        "i can imagine",
        "that must be",
        "i hear you"
      ],
      "neg": [
        "calm down"
      ]
    },
    {
      "id": "ac3",
      "desc": "",
      "weight": 1,
      "enabled": true,
      "system": true,
      "name": "Professional language",
      "maps": "Vocabulary & Professionalism",
      "pos": [
        "please",
        "certainly",
        "of course",
        "happy to help"
      ],
      "neg": [
        "whatever",
        "not my problem",
        "no idea",
        "you should have"
      ]
    },
    {
      "id": "ac4",
      "desc": "",
      "weight": 1,
      "enabled": true,
      "system": true,
      "name": "Solution and next steps",
      "maps": "Process Adherence",
      "pos": [
        "i will send",
        "next step",
        "follow up",
        "i have noted",
        "i will check",
        "i have updated"
      ],
      "neg": []
    },
    {
      "id": "ac5",
      "desc": "",
      "weight": 1,
      "enabled": true,
      "system": true,
      "name": "Objection handling",
      "maps": "Persuasion & Objection Handling",
      "pos": [
        "what i can offer",
        "the value",
        "many customers",
        "compared to",
        "let me show"
      ],
      "neg": [
        "take it or leave it"
      ]
    },
    {
      "id": "ac6",
      "desc": "",
      "weight": 1,
      "enabled": true,
      "system": true,
      "name": "Closing",
      "maps": "Closing & Positive Outcome",
      "pos": [
        "anything else",
        "thank you for",
        "have a great",
        "have a nice",
        "is there anything"
      ],
      "neg": []
    }
  ],
  "conversations": [],
  "workspaces": [
    {
      "id": "w-main",
      "name": "Main workspace",
      "desc": "Everything is here until you create more workspaces",
      "color": "#2563eb",
      "teams": [
        "t-b2c",
        "t-b2b",
        "t-40aeb9"
      ],
      "scorecards": [
        "sc-default"
      ],
      "staff": [
        "g.nikolova",
        "g.pencheva",
        "m.duval",
        "n.ivanova",
        "i.marinova",
        "b.kolev"
      ]
    }
  ]
};

function restore() {
  const F = process.env.DATA_FILE ? path.resolve(process.env.DATA_FILE) : path.join(__dirname, 'data.json');   // DATA_FILE: the same copy the server uses
  const B = F.replace(/\.json$/, '') + '.backup.json';
  if (fs.existsSync(F)) fs.copyFileSync(F, B);
  fs.writeFileSync(F, JSON.stringify(DATA, null, 2));
}
module.exports = { DATA, restore };
if (require.main === module) { restore(); console.log('data.json restored from seed.js'); }
