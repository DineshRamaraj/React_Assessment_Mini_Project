const Home = () => (
  <HomeContainer>
    <ImageContainer>
      <HomeImage
        src="https://res.cloudinary.com/dhwz560kk/image/upload/v1711474569/ayzntxspgqzxrpjkabrg.png"
        alt="assessment"
      />
    </ImageContainer>
    <MainHomeContainer>
      <HomeInstructions>Instructions</HomeInstructions>
      <HomeListContainer>
        <HomeItem>1. Total Questions: 10</HomeItem>
        <HomeItem>2. Types of Questions: MCQs</HomeItem>
        <HomeItem>3. Duration: 10 Mins</HomeItem>
        <HomeItem>
          4. Making Scheme: Every Correct response, get 1 mark
        </HomeItem>
        <HomeItem>
          5. All the progress will be lost. if you reload during the assessment
        </HomeItem>
      </HomeListContainer>
      <HomeStartButton type="button">Start Assessment</HomeStartButton>
    </MainHomeContainer>
  </HomeContainer>
)

export default Home
