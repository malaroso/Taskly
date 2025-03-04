import LottieView from "lottie-react-native";
import { View, Text, StyleSheet , Dimensions} from "react-native";

const { width, height } = Dimensions.get('window');
const Messages = () => {
    return (
        <View style={styles.container}>
                  <View style={styles.emptyContainer}>
                    <LottieView
                        source={require('../../assets/images/comingSoonAnimation.json')}
                        autoPlay
                        loop
                        style={styles.lottieAnimation}
                    />
                    <Text style={styles.emptyTitle}>Coming Soon</Text>
                    <Text style={styles.emptySubtitle}>
                        This feature is coming soon
                    </Text>
                </View>
        </View>
    );
};  

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',   
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: -100,
        alignItems: 'center',
        padding: 20,
    },
    lottieAnimation: {
        width: width * 0.7,
        height: width * 0.7,
    },
    loadingAnimation: {
        width: width * 0.5,
        height: width * 0.5,
    },
    emptyTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: '#333',
        marginTop: -20,
        marginBottom: 10,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: '#666',
        textAlign: 'center',
        maxWidth: '80%',
    },
});

export default Messages;