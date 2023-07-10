import { Platform, StyleSheet } from "react-native";
import { SIZES, COLORS, theme } from "../../../../сonstants";


export const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        marginBottom: 5,
        paddingLeft: SIZES.padding,
        paddingRight: SIZES.padding,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: COLORS.gray
        //backgroundColor: 'red'
    },
    inputWrapper: {
        overflow: 'hidden',
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    inputText: {
        paddingTop: 12,
        paddingBottom: 12,
        textAlignVertical: 'center',
        width: '85%',

    },
    inputInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputCount: {
        color: COLORS.primary,
        textAlign: 'center',
        textAlignVertical: 'center',
        width: '100%',
    },
    inputCountWrapper: {
        marginRight: 9,
        width: 20,
        height: 20,
        borderRadius: 100,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    photoDelete: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: COLORS.primary,
        padding: 12,
        overflow: 'hidden',
        borderRadius: 100,
    },
    photoPickerInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 5,
        marginVertical: 10
    },
    photoPickerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.red,
        paddingLeft: SIZES.padding,
        paddingRight: SIZES.padding,
        paddingVertical: 10,
        borderRadius: SIZES.radius,
        width: '49%',
    },
    photoPickerText: {
        color: COLORS.red,
        paddingLeft: 12,
    },
    photoInner: {
        width: '100%',
        paddingBottom: 5,
        paddingTop: 5,
        position: 'relative',
    },

    photoSurface: {
        marginRight: 8,
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: '#cccccc33',
        width: 240,
        height: 160,
        marginTop: 10,
    },
    durationText: {
        fontSize: 16,
        color: 'white'
    },
    durationView: {
        alignSelf: 'flex-end',
        padding: 5,
        backgroundColor: 'black',
        opacity: 0.5,
        borderRadius: 10,
        margin: 5
    },
    modalView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        //borderWidth: 1,
    },
    typeButton: {
        borderWidth: 1,
        borderColor: COLORS.red,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        marginVertical: 5
    },
    typeButtonText: {
        color: COLORS.red,
    },
    cancelButton: {
        backgroundColor: COLORS.red,
        padding: SIZES.padding,
        marginVertical: 5,
        borderRadius: SIZES.radius,
    },
    cancelButtonText: {
        color: 'white'
    },
    arrowView: {
        paddingRight: 2,
        //backgroundColor: 'red'
    },
    arrow: {
        width: 13,
        height: 7,
        resizeMode: 'contain'
    },
    disclaimerView: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    disclaimerText: {
        fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SF',
        lineHeight: 24,
        fontWeight: '500',
        color: '#B6B6B6',
        textAlign: 'center'
    }
})
