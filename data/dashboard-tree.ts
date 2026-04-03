import type { Company } from "@/types/dashboard";

export const DASHBOARD_TREE: Company[] = [
  {
    id: "c1",
    name: "Routes",
    routes: [
      {
        id: "r1",
        name: "David Route",
        leases: [
          {
            id: "l1",
            name: "Johnson Lease",
            areas: [
              {
                id: "a1",
                name: "Texas",
                wells: [
                  { id: "w1", name: "Well TX-1" },
                  { id: "w2", name: "Well TX-2" },
                ],
              },
              {
                id: "a2",
                name: "Oklahoma",
                wells: [{ id: "w3", name: "Well OK-1" }],
              },
            ],
          },
          {
            id: "l2",
            name: "Davis Lease",
            areas: [
              {
                id: "a3",
                name: "New Mexico",
                wells: [
                  { id: "w4", name: "Well NM-1" },
                  { id: "w5", name: "Well NM-2" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "r2",
        name: "Johnson Route",
        leases: [
          {
            id: "l3",
            name: "Mitchell Lease",
            areas: [
              {
                id: "a4",
                name: "Kansas",
                wells: [{ id: "w6", name: "Well KS-1" }],
              },
              {
                id: "a5",
                name: "Colorado",
                wells: [
                  { id: "w7", name: "Well CO-1" },
                  { id: "w8", name: "Well CO-2" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c2",
    name: "1978 Investments",
    routes: [
      {
        id: "r3",
        name: "Williams Route",
        leases: [
          {
            id: "l4",
            name: "Thlocco Lease",
            areas: [
              {
                id: "a6",
                name: "Oklahoma",
                wells: [
                  { id: "w9", name: "Well OK-2" },
                  { id: "w10", name: "Well OK-3" },
                ],
              },
              {
                id: "a7",
                name: "Texas",
                wells: [{ id: "w11", name: "Well TX-3" }],
              },
            ],
          },
          {
            id: "l5",
            name: "Anderson Lease",
            areas: [
              {
                id: "a8",
                name: "Wyoming",
                wells: [{ id: "w12", name: "Well WY-1" }],
              },
            ],
          },
        ],
      },
      {
        id: "r4",
        name: "Thompson Route",
        leases: [
          {
            id: "l6",
            name: "Harris Lease",
            areas: [
              {
                id: "a9",
                name: "North Dakota",
                wells: [
                  { id: "w13", name: "Well ND-1" },
                  { id: "w14", name: "Well ND-2" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c3",
    name: "AGV Corporation",
    routes: [
      {
        id: "r5",
        name: "Martin Route",
        leases: [
          {
            id: "l7",
            name: "Garcia Lease",
            areas: [
              {
                id: "a10",
                name: "Texas",
                wells: [
                  { id: "w15", name: "Well TX-4" },
                  { id: "w16", name: "Well TX-5" },
                ],
              },
              {
                id: "a11",
                name: "Louisiana",
                wells: [{ id: "w17", name: "Well LA-1" }],
              },
            ],
          },
          {
            id: "l8",
            name: "Clark Lease",
            areas: [
              {
                id: "a12",
                name: "Mississippi",
                wells: [{ id: "w18", name: "Well MS-1" }],
              },
            ],
          },
        ],
      },
      {
        id: "r6",
        name: "Robinson Route",
        leases: [
          {
            id: "l9",
            name: "Lewis Lease",
            areas: [
              {
                id: "a13",
                name: "Oklahoma",
                wells: [
                  { id: "w19", name: "Well OK-4" },
                  { id: "w20", name: "Well OK-5" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c4",
    name: "Bennett Resources",
    routes: [
      {
        id: "r7",
        name: "Walker Route",
        leases: [
          {
            id: "l10",
            name: "Hall Lease",
            areas: [
              {
                id: "a14",
                name: "Montana",
                wells: [{ id: "w21", name: "Well MT-1" }],
              },
              {
                id: "a15",
                name: "Idaho",
                wells: [
                  { id: "w22", name: "Well ID-1" },
                  { id: "w23", name: "Well ID-2" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "r8",
        name: "Allen Route",
        leases: [
          {
            id: "l11",
            name: "Young Lease",
            areas: [
              {
                id: "a16",
                name: "Utah",
                wells: [{ id: "w24", name: "Well UT-1" }],
              },
            ],
          },
          {
            id: "l12",
            name: "King Lease",
            areas: [
              {
                id: "a17",
                name: "Nevada",
                wells: [
                  { id: "w25", name: "Well NV-1" },
                  { id: "w26", name: "Well NV-2" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c5",
    name: "Arcadian Resources",
    routes: [
      {
        id: "r9",
        name: "Scott Route",
        leases: [
          {
            id: "l13",
            name: "Adams Lease",
            areas: [
              {
                id: "a18",
                name: "Texas",
                wells: [{ id: "w27", name: "Well TX-6" }],
              },
              {
                id: "a19",
                name: "Arkansas",
                wells: [
                  { id: "w28", name: "Well AR-1" },
                  { id: "w29", name: "Well AR-2" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
