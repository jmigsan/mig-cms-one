import { Box, Flex, Text, Image, HStack } from '@chakra-ui/react';
import { SetStateAction, useState } from 'react';

const Carousel = ({ imageArr }: { imageArr: string[] }) => {
  const arrowStyles = {
    cursor: 'pointer',
    pos: 'absolute',
    top: '50%',
    w: 'auto',
    mt: '-22px',
    p: '16px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    transition: '0.6s ease',
    borderRadius: '0 3px 3px 0',
    userSelect: 'none',
    _hover: {
      opacity: 0.8,
      bg: 'black',
    },
  };
  // const slides = [
  //   {
  //     img: 'https://images.pexels.com/photos/2599537/pexels-photo-2599537.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  //   },
  //   {
  //     img: 'https://images.pexels.com/photos/2714581/pexels-photo-2714581.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  //   },
  //   {
  //     img: 'https://images.pexels.com/photos/2878019/pexels-photo-2878019.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
  //   },
  //   {
  //     img: 'https://images.pexels.com/photos/1142950/pexels-photo-1142950.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  //   },
  //   {
  //     img: 'https://images.pexels.com/photos/3124111/pexels-photo-3124111.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  //   },
  // ];
  // const slides = [
  //   'https://f004.backblazeb2.com/file/mig-cms-one/uho8emdb66plc7.jpeg',
  //   'https://f004.backblazeb2.com/file/mig-cms-one/j4xk1rdf38nrox.png',
  //   'https://f004.backblazeb2.com/file/mig-cms-one/4gwja0hj0117ke.jpeg',
  // ];

  const [currentSlide, setCurrentSlide] = useState(0);
  // const slidesCount = slides.length;
  const slidesCount = imageArr.length;

  const prevSlide = () => {
    setCurrentSlide((s) => (s === 0 ? slidesCount - 1 : s - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((s) => (s === slidesCount - 1 ? 0 : s + 1));
  };

  const setSlide = (slide: SetStateAction<number>) => {
    setCurrentSlide(slide);
  };

  const carouselStyle = {
    transition: 'all .5s',
    ml: `-${currentSlide * 100}%`,
  };

  console.log(imageArr);

  return (
    <Flex
      w='full'
      bg='#edf3f8'
      _dark={{
        bg: '#3e3e3e',
      }}
      p={10}
      alignItems='center'
      justifyContent='center'
    >
      <Flex w='full' overflow='hidden' pos='relative'>
        <Flex h='400px' w='full' {...carouselStyle}>
          {imageArr.map((slide, sid) => (
            <Box key={`slide-${sid}`} boxSize='full' shadow='md' flex='none'>
              <Text
                color='white'
                fontSize='xs'
                p='8px 12px'
                pos='absolute'
                top='0'
              >
                {sid + 1} / {slidesCount}
              </Text>
              <Image
                src={slide}
                alt='carousel image'
                boxSize='full'
                backgroundSize='cover'
              />
            </Box>
          ))}
        </Flex>
        {/* @ts-ignore */}
        <Text {...arrowStyles} left='0' onClick={prevSlide}>
          &#10094;
        </Text>
        {/* @ts-ignore */}
        <Text {...arrowStyles} right='0' onClick={nextSlide}>
          &#10095;
        </Text>
        <HStack justify='center' pos='absolute' bottom='8px' w='full'>
          {Array.from({
            length: slidesCount,
          }).map((_, slide) => (
            <Box
              key={`dots-${slide}`}
              cursor='pointer'
              boxSize={['7px', null, '15px']}
              m='0 2px'
              bg={currentSlide === slide ? 'blackAlpha.800' : 'blackAlpha.500'}
              rounded='50%'
              display='inline-block'
              transition='background-color 0.6s ease'
              _hover={{
                bg: 'blackAlpha.800',
              }}
              onClick={() => setSlide(slide)}
            ></Box>
          ))}
        </HStack>
      </Flex>
    </Flex>
  );
};

export default Carousel;
