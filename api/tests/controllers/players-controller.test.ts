import { request } from "@/support"

describe("api/src/controllers/players-controller.ts", () => {
  describe("PlayersController", () => {
    describe("#index", () => {
      test("when no players exist, get no players", async () => {
        // Arrange
        // Act
        const { body } = await request().get("/api/players")
        const { players, totalCount } = body

        // Assert
        expect(players).toMatchObject([])
        expect(totalCount).eq(0)
      })
    })
    // describe("#show", () => {})
    // describe("#create", () => {})
    // describe("#update", () => {})
    // describe("#destroy", () => {})
  })
})
